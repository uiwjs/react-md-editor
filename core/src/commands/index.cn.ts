import { type ICommand } from './';
import { divider } from './divider';
import { group } from './group';

import { bold as boldInit } from './bold';
import { code as codeInit, codeBlock as codeBlockInit } from './code';
import { comment as commentInit } from './comment';
import { fullscreen as fullscreenInit } from './fullscreen';
import { hr as hrInit } from './hr';
import { image as imageInit } from './image';
import { italic as italicInit } from './italic';
import { link as linkInit } from './link';
import {
  checkedListCommand as checkedListCommandInit,
  orderedListCommand as orderedListCommandInit,
  unorderedListCommand as unorderedListCommandInit,
} from './list';
import { codeEdit as codeEditInit, codeLive as codeLiveInit, codePreview as codePreviewInit } from './preview';
import { quote as quoteInit } from './quote';
import { strikethrough as strikethroughInit } from './strikeThrough';
import { issue as issueInit } from './issue';
import { title as titleInit } from './title';
import { title1 as title1Init } from './title1';
import { title2 as title2Init } from './title2';
import { title3 as title3Init } from './title3';
import { title4 as title4Init } from './title4';
import { title5 as title5Init } from './title5';
import { title6 as title6Init } from './title6';
import { table as tableInit } from './table';
import { help as helpInit } from './help';

let bold: ICommand = {
  ...boldInit,
  buttonProps: { 'aria-label': '添加粗体文本(ctrl + b)', title: '添加粗体文本(ctrl + b)' },
};
let code: ICommand = { ...codeInit, buttonProps: { 'aria-label': '插入代码(ctrl + j)', title: '插入代码(ctrl + j)' } };
let codeBlock: ICommand = {
  ...codeBlockInit,
  buttonProps: { 'aria-label': '插入代码块(ctrl + shift + j)', title: '插入代码块(ctrl + shift + j)' },
};
let comment: ICommand = {
  ...commentInit,
  buttonProps: { 'aria-label': '插入注释(ctrl + /)', title: '插入注释(ctrl + /)' },
};
let fullscreen: ICommand = {
  ...fullscreenInit,
  buttonProps: { 'aria-label': '切换全屏(ctrl + 0)', title: '切换全屏(ctrl + 0)' },
};
let hr: ICommand = { ...hrInit, buttonProps: { 'aria-label': '插入HR (ctrl + h)', title: '插入HR (ctrl + h)' } };
let image: ICommand = {
  ...imageInit,
  buttonProps: { 'aria-label': '添加图像(ctrl + k)', title: '添加图像(ctrl + k)' },
};
let italic: ICommand = {
  ...italicInit,
  buttonProps: { 'aria-label': '添加斜体文本(ctrl + i)', title: '添加斜体文本(ctrl + i)' },
};
let link: ICommand = { ...linkInit, buttonProps: { 'aria-label': '添加链接(ctrl + l)', title: '添加链接(ctrl + l)' } };
let checkedListCommand: ICommand = {
  ...checkedListCommandInit,
  buttonProps: { 'aria-label': '添加检查列表(ctrl + shift + c)', title: '添加检查列表(ctrl + shift + c)' },
};
let orderedListCommand: ICommand = {
  ...orderedListCommandInit,
  buttonProps: { 'aria-label': '添加有序列表(ctrl + shift + o)', title: '添加有序列表(ctrl + shift + o)' },
};
let unorderedListCommand: ICommand = {
  ...unorderedListCommandInit,
  buttonProps: {
    'aria-label': '添加无序列表(ctrl + shift + u)',
    title: '添加无序列表(ctrl + shift + u)',
  },
};
let codeEdit: ICommand = {
  ...codeEditInit,
  buttonProps: { 'aria-label': '编辑代码(ctrl + 7)', title: '编辑代码(ctrl + 7)' },
};
let codeLive: ICommand = {
  ...codeLiveInit,
  buttonProps: { 'aria-label': '实时代码(ctrl + 8)', title: '实时代码(ctrl + 8)' },
};
let codePreview: ICommand = {
  ...codePreviewInit,
  buttonProps: { 'aria-label': '预览代码(ctrl + 9)', title: '预览代码(ctrl + 9)' },
};
let quote: ICommand = {
  ...quoteInit,
  buttonProps: { 'aria-label': '预览代码(ctrl + 9)', title: '预览代码(ctrl + 9)' },
};

let strikethrough: ICommand = {
  ...strikethroughInit,
  buttonProps: {
    'aria-label': 'Add strikethrough text (ctrl + shift + x)',
    title: 'Add strikethrough text (ctrl + shift + x)',
  },
};
let issue: ICommand = { ...issueInit, buttonProps: { 'aria-label': '添加 issue', title: '添加 issue' } };
let title: ICommand = {
  ...titleInit,
  buttonProps: { 'aria-label': '插入 title (ctrl + 1)', title: '插入 title (ctrl + 1)' },
};
let title1: ICommand = {
  ...title1Init,
  buttonProps: { 'aria-label': '插入 title1 (ctrl + 1)', title: '插入 title1 (ctrl + 1)' },
};
let title2: ICommand = {
  ...title2Init,
  buttonProps: { 'aria-label': '插入 title2 (ctrl + 2)', title: '插入 title2 (ctrl + 2)' },
};
let title3: ICommand = {
  ...title3Init,
  buttonProps: { 'aria-label': '插入 title3 (ctrl + 3)', title: '插入 title3 (ctrl + 3)' },
};
let title4: ICommand = {
  ...title4Init,
  buttonProps: { 'aria-label': '插入 title4 (ctrl + 4)', title: '插入 title4 (ctrl + 4)' },
};
let title5: ICommand = {
  ...title5Init,
  buttonProps: { 'aria-label': '插入 title5 (ctrl + 5)', title: '插入 title5 (ctrl + 5)' },
};
let title6: ICommand = {
  ...title6Init,
  buttonProps: { 'aria-label': '插入 title6 (ctrl + 6)', title: '插入 title6 (ctrl + 6)' },
};
let table: ICommand = { ...tableInit, buttonProps: { 'aria-label': '添加表格', title: '添加表格' } };
let help: ICommand = { ...helpInit, buttonProps: { 'aria-label': '打开帮助', title: '打开帮助' } };

export const getCommands: () => ICommand[] = () => [
  bold,
  italic,
  strikethrough,
  hr,
  group([title1, title2, title3, title4, title5, title6], {
    name: 'title',
    groupName: 'title',
    buttonProps: { 'aria-label': '插入标题', title: 'I插入标题' },
  }),
  divider,
  link,
  quote,
  code,
  codeBlock,
  comment,
  image,
  table,
  divider,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  divider,
  help,
];

export const getExtraCommands: () => ICommand[] = () => [codeEdit, codeLive, codePreview, divider, fullscreen];
export {
  title,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  bold,
  codeBlock,
  comment,
  italic,
  strikethrough,
  hr,
  group,
  divider,
  link,
  quote,
  code,
  image,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  table,
  issue,
  help,
  codeEdit,
  codeLive,
  codePreview,
  fullscreen,
};
