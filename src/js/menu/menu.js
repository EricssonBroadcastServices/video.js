/**
 * @file menu.js
 */
import Component from '../component.js';
import document from 'global/document';
import * as Dom from '../utils/dom.js';
import * as Fn from '../utils/fn.js';
import * as Events from '../utils/events.js';
import {IS_UWP, KeyCodeMapGamePad} from '../utils/uwp.js';

/**
 * The Menu component is used to build popup menus, including subtitle and
 * captions selection menus.
 *
 * @extends Component
 */
class Menu extends Component {

  /**
   * Create an instance of this class.
   *
   * @param {Player} player
   *        the player that this component should attach to
   *
   * @param {Object} [options]
   *        Object of option names and values
   *
   */
  constructor(player, options) {
    super(player, options);

    if (options) {
      this.menuButton_ = options.menuButton;
    }

    this.focusedChild_ = -1;

    this.on('keydown', this.handleKeyPress);
  }

  /**
   * Add a {@link MenuItem} to the menu.
   *
   * @param {Object|string} component
   *        The name or instance of the `MenuItem` to add.
   *
   */
  addItem(component) {
    this.addChild(component);
    component.on('blur', Fn.bind(this, this.handleBlur));
    component.on(['tap', 'click'], Fn.bind(this, function(event) {
      // Unpress the associated MenuButton, and move focus back to it
      if (this.menuButton_) {
        this.menuButton_.unpressButton();

        // don't focus menu button if item is a caption settings item
        // because focus will move elsewhere
        if (component.name() !== 'CaptionSettingsMenuItem') {
          this.menuButton_.focus();
        }
      }
    }));
  }

  /**
   * Create the `Menu`s DOM element.
   *
   * @return {Element}
   *         the element that was created
   */
  createEl() {
    const contentElType = this.options_.contentElType || 'ul';

    this.contentEl_ = Dom.createEl(contentElType, {
      className: 'vjs-menu-content'
    });

    this.contentEl_.setAttribute('role', 'menu');

    const el = super.createEl('div', {
      append: this.contentEl_,
      className: 'vjs-menu'
    });

    el.appendChild(this.contentEl_);

    // Prevent clicks from bubbling up. Needed for Menu Buttons,
    // where a click on the parent is significant
    Events.on(el, 'click', function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    });

    return el;
  }

  dispose() {
    this.contentEl_ = null;

    super.dispose();
  }

  /**
   * Called when a `MenuItem` loses focus.
   *
   * @param {EventTarget~Event} event
   *        The `blur` event that caused this function to be called.
   *
   * @listens blur
   */
  handleBlur(event) {
    const relatedTarget = event.relatedTarget || document.activeElement;

    // Close menu popup when a user clicks outside the menu
    if (!this.children().some((element) => {
      return element.el() === relatedTarget;
    })) {
      const btn = this.menuButton_;

      if (btn && btn.buttonPressed_ && relatedTarget !== btn.el().firstChild) {
        btn.unpressButton();
      }
    }
  }

  /**
   * Handle a `keydown` event on this menu. This listener is added in the constructor.
   *
   * @param {EventTarget~Event} event
   *        A `keydown` event that happened on the menu.
   *
   * @listens keydown
   */
  handleKeyPress(event) {
    // Handle UMP Apps Down Arrows
    if (IS_UWP && KeyCodeMapGamePad.down.indexOf(event.which) !== -1) {
      event.preventDefault();
      this.stepForward();
      return;
    // Up Arrows
    } else if (IS_UWP && KeyCodeMapGamePad.up.indexOf(event.which) !== -1) {
      event.preventDefault();
      this.stepBack();
      return;
    }

    // Left and Down Arrows
    if (event.which === 37 || event.which === 40) {
      event.preventDefault();
      this.stepForward();

    // Up and Right Arrows
    } else if (event.which === 38 || event.which === 39) {
      event.preventDefault();
      this.stepBack();
    }
  }

  /**
   * Move to next (lower) menu item for keyboard users.
   */
  stepForward() {
    let stepChild = 0;

    if (this.focusedChild_ !== undefined) {
      stepChild = this.focusedChild_ + 1;
    }
    this.focus(stepChild);
  }

  /**
   * Move to previous (higher) menu item for keyboard users.
   */
  stepBack() {
    let stepChild = 0;

    if (this.focusedChild_ !== undefined) {
      stepChild = this.focusedChild_ - 1;
    }
    this.focus(stepChild);
  }

  /**
   * Set focus on a {@link MenuItem} in the `Menu`.
   *
   * @param {Object|string} [item=0]
   *        Index of child item set focus on.
   */
  focus(item) {
    const children = [];

    // Only selectable children
    for (let i = 0; i < this.children().length; i++) {
      if (this.children()[i].selectable) {
        children.push(this.children()[i]);
      }
    }

    const haveTitle = children.length && children[0].className &&
      (/vjs-menu-title/).test(children[0].className);

    if (haveTitle) {
      children.shift();
    }

    if (children.length > 0) {
      if (item === undefined) {
        item = 0;
        // Find Selected item
        for (let i = 0; i < children.length; i++) {
          if (children[i].isSelected_) {
            item = i;
            break;
          }
        }
      }

      if (item < 0) {
        item = 0;
      } else if (item >= children.length) {
        item = children.length - 1;
      }

      this.focusedChild_ = item;

      children[item].el_.focus();
    }
  }
}

Component.registerComponent('Menu', Menu);
export default Menu;
