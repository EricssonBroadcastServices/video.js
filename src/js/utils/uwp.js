import window from 'global/window';

const USER_AGENT = window.navigator && window.navigator.userAgent || '';

/**
 * It it running on Universal Windows Platform (UWP) Windows Store App or xBox
 */
export const IS_UWP = (/MSAppHost/i).test(USER_AGENT) || (/Xbox/i).test(USER_AGENT) || (/XboxOne/i).test(USER_AGENT) || window.DEBUG_UWP;

/**
 * Key Code Mapping for GamePad
 */
export const KeyCodeMapGamePad = {
  left: [
    // LeftArrow
    37,
    // GamepadLeftThumbstickLeft
    214,
    // GamepadDPadLeft
    205,
    // NavigationLeft
    140
  ],
  right: [
    // RightArrow
    39,
    // GamepadLeftThumbstickRight
    213,
    // GamepadDPadRight
    206,
    // NavigationRight
    141
  ],
  up: [
    // UpArrow
    38,
    // GamepadLeftThumbstickUp
    211,
    // GamepadDPadUp
    203,
    // NavigationUp
    138
  ],
  down: [
    // UpArrow
    40,
    // GamepadLeftThumbstickDown
    212,
    // GamepadDPadDown
    204,
    // NavigationDown
    139
  ],
  accept: [
    // Space
    32,
    // Enter
    13,
    // NavigationAccept
    142,
    // GamepadA
    195
  ],
  return: [
    // Backspace
    8,
    // NavigationCancel
    143,
    // GamepadB
    196
  ]
};
