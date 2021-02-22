const isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false;
// Special Keys

interface keyMap {
  [propName: string]: number | string;
}

// type StatusKey = 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey'

// enum E1 { 'shiftKey', 'altKey', 'ctrlKey', 'metaKey' }

interface Event extends React.KeyboardEvent<HTMLTextAreaElement> {
  [propName: string]: any;
}

// interface OnKeyDown (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;

const _keyMap: keyMap = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  "'": 222,
  '[': 219,
  ']': 221,
  '\\': 220,
};

// Modifier Keys
const _modifier: keyMap = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91,
};
const modifierMap: keyMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',

  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91,
};
const _mods = {
  16: false,
  18: false,
  17: false,
  91: false,
};
const _handlers = {};

// F1~F12 special key
for (let k = 1; k < 20; k++) {
  _keyMap[`f${k}`] = 111 + k;
}
// 获取键编码
function getCode(keyStr: string) {
  return _keyMap[keyStr.toLowerCase()] || _modifier[keyStr.toLowerCase()] || keyStr.toUpperCase().charCodeAt(0);
}

// 处理传的key字符串转换成数组
function getKeys(key: string) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等
  const keys = key.split(','); // 同时设置多个快捷键，以','分割
  let index = keys.lastIndexOf('');

  // 快捷键可能包含','，需特殊处理
  for (; index >= 0; ) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }
  const keyList = [];
  // [crtl+a, crtl+b]
  for (let i = 0; i < keys.length; i++) {
    const keyStrList: string[] = keys[i].split('+');
    const keyCodes = keyStrList.length > 0 ? keyStrList.map((item) => getCode(item)) : [];
    keyList.push(keyCodes.sort().join(''));
  }
  return keyList;
}

function getKeyboardCode(event: Event) {
  // debugger;
  let _downKeys: Array<any> = [];
  var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

  // 获取code
  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach((keyName) => {
    const keyNum = modifierMap[keyName]; // code
    const clickKeyName = event[keyName]; // codeName
    const index = _downKeys.indexOf(keyNum); // 是否已存
    //
    if (clickKeyName && index === -1) {
      _downKeys.push(keyNum);
    }
    //  else if (!clickKeyName || index > -1) {
    //   _downKeys.splice(index, 1);
    // } else if (keyName === 'metaKey' && clickKeyName && _downKeys.length === 3) {
    //   if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
    //     _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
    //   }
    // }
  });
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */
  if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }

    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }
  }
  return _downKeys;
}

export { _keyMap, _modifier, modifierMap, _mods, _handlers, getKeys, getCode, getKeyboardCode };
