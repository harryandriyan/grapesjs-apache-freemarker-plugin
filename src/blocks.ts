import type grapesjs from 'grapesjs';
import { PluginOptions } from '.';
import { 
  typeIfCondition,
  typeList,
  typeVariable 
} from './utils';

export default (editor: grapesjs.Editor, { blockCustomCode }: PluginOptions = {}) => {
  const { Blocks } = editor;

  blockCustomCode && Blocks.add(typeIfCondition, {
    label: 'IF Condition',
    media: `
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
        <path id="condition--builder_1_" d="M30,30.36H2c-0.199,0-0.36-0.161-0.36-0.36V2c0-0.199,0.161-0.36,0.36-0.36h28
                      c0.199,0,0.36,0.161,0.36,0.36v28C30.36,30.199,30.199,30.36,30,30.36z M2.36,29.64h27.28V2.36H2.36V29.64z M8.155,20.896h2.976
                      v-6.048H8.155v-1.104h4.256v7.152h2.784V22h-7.04V20.896z M11.771,11.92c-0.374,0-0.635-0.077-0.784-0.232
                      c-0.149-0.154-0.224-0.349-0.224-0.584v-0.256c0-0.235,0.074-0.429,0.224-0.584s0.411-0.232,0.784-0.232s0.634,0.077,0.784,0.232
                      c0.149,0.155,0.224,0.349,0.224,0.584v0.256c0,0.235-0.075,0.43-0.224,0.584C12.406,11.843,12.145,11.92,11.771,11.92z
                        M17.313,20.896h2.784v-6.048h-2.944v-1.104h2.944v-1.696c0-0.554,0.146-1.008,0.44-1.36s0.755-0.528,1.384-0.528h2.768v1.104
                      h-3.312v2.48h3.312v1.104h-3.312v6.048h2.944V22h-7.008C17.313,22,17.313,20.896,17.313,20.896z"/>
        <rect id="_Transparent_Rectangle" style="fill:none;" width="32" height="32"/>
      </svg>
    `,
    category: 'Apache FreeMarker',
    activate: true,
    select: true,
    content: { type: typeIfCondition },
    ...blockCustomCode
  });

  blockCustomCode && Blocks.add(typeList, {
    label: 'List',
    media: `
      <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/>
          </g>
      </svg>
    `,
    category: 'Apache FreeMarker',
    activate: true,
    select: true,
    content: { type: typeList },
    ...blockCustomCode
  });

  blockCustomCode && Blocks.add(typeVariable, {
    label: 'Variable',
    media: `
      <svg viewBox="0 0 24 24">
        <path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"></path>
      </svg>
    `,
    category: 'Apache FreeMarker',
    activate: true,
    select: true,
    content: { type: typeVariable },
    ...blockCustomCode
  });
}
