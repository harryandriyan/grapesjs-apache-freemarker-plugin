import type grapesjs from 'grapesjs';
import { PluginOptions } from '.';
import { 
  keyCustomCode,
  commandNameIf,
  commandNameList,
  commandNameVar,
  typeIfCondition,
  typeList,
  typeVariable
} from './utils';

export default (editor: grapesjs.Editor, opts: PluginOptions = {}) => {
  const { Components } = editor;
  const { toolbarBtnCustomCode } = opts;
  let timedInterval: NodeJS.Timeout;

  // @ts-ignore
  const addComponent = ({ componentType, modelName, modelContent, commandName }) => {

    return Components.addType(componentType, {
      model: {
        defaults: {
          name: modelName,
          editable: true,
          components: {
            tagName: 'span',
            components: { type: 'textnode', content: modelContent }
          },
          ...opts.propsCustomCode,
        },
  
        /**
         * Initilize the component
         */
        init() {
          // @ts-ignore
          this.on(`change:${keyCustomCode}`, this.onCustomCodeChange);
          const initialCode = this.get(keyCustomCode);
          !this.components().length && this.components(initialCode);
          const toolbar = this.get('toolbar');
          const id = 'custom-code';
  
          // Add the custom code toolbar button if requested and it's not already in
          // @ts-ignore
          if (toolbarBtnCustomCode && !toolbar.filter(tlb => tlb.id === id ).length) {
            let labelIcon = `<svg viewBox="0 0 24 24">
              <path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"></path>
            </svg>`;
            switch (commandName) {
              case commandNameIf:
                  labelIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
               <path id="condition--builder_1_" d="M30,30.36H2c-0.199,0-0.36-0.161-0.36-0.36V2c0-0.199,0.161-0.36,0.36-0.36h28
                 c0.199,0,0.36,0.161,0.36,0.36v28C30.36,30.199,30.199,30.36,30,30.36z M2.36,29.64h27.28V2.36H2.36V29.64z M8.155,20.896h2.976
                 v-6.048H8.155v-1.104h4.256v7.152h2.784V22h-7.04V20.896z M11.771,11.92c-0.374,0-0.635-0.077-0.784-0.232
                 c-0.149-0.154-0.224-0.349-0.224-0.584v-0.256c0-0.235,0.074-0.429,0.224-0.584s0.411-0.232,0.784-0.232s0.634,0.077,0.784,0.232
                 c0.149,0.155,0.224,0.349,0.224,0.584v0.256c0,0.235-0.075,0.43-0.224,0.584C12.406,11.843,12.145,11.92,11.771,11.92z
                  M17.313,20.896h2.784v-6.048h-2.944v-1.104h2.944v-1.696c0-0.554,0.146-1.008,0.44-1.36s0.755-0.528,1.384-0.528h2.768v1.104
                 h-3.312v2.48h3.312v1.104h-3.312v6.048h2.944V22h-7.008C17.313,22,17.313,20.896,17.313,20.896z"/>
               <rect id="_Transparent_Rectangle" style="fill:none;" width="32" height="32"/>
               </svg>`;
                break;
              case commandNameList:
                  labelIcon = `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2" d="M9,6 L21,6 M9,12 L21,12 M9,18 L17,18 M4,7 C4.55228475,7 5,6.55228475 5,6 C5,5.44771525 4.55228475,5 4,5 C3.44771525,5 3,5.44771525 3,6 C3,6.55228475 3.44771525,7 4,7 Z M4,13 C4.55228475,13 5,12.5522847 5,12 C5,11.4477153 4.55228475,11 4,11 C3.44771525,11 3,11.4477153 3,12 C3,12.5522847 3.44771525,13 4,13 Z M4,19 C4.55228475,19 5,18.5522847 5,18 C5,17.4477153 4.55228475,17 4,17 C3.44771525,17 3,17.4477153 3,18 C3,18.5522847 3.44771525,19 4,19 Z"/>
                </svg>`;
                break;
              default:
                break;
            }
            // @ts-ignore
            toolbar.unshift({
              id,
              command: commandName,
              label: labelIcon,
              ...toolbarBtnCustomCode
            });
          }
        },
  
        /**
         * Callback to launch on keyCustomCode change
         */
        // @ts-ignore
        onCustomCodeChange() {
          // @ts-ignore
          this.components(this.get(keyCustomCode));
        },
      },
  
      view: {
        events: {
          dblclick: 'onActive',
        },
  
        init() {
          // @ts-ignore
          this.listenTo(this.model.components(), 'add remove reset', this.onComponentsChange);
          // @ts-ignore
          this.onComponentsChange();
        },
  
        /**
         * Things to do once inner components of custom code are changed
         */
        // @ts-ignore
        onComponentsChange() {
          timedInterval && clearInterval(timedInterval);
          timedInterval = setTimeout(() => {
            // @ts-ignore
            const { model, el } = this;
            const content = model.get(keyCustomCode) || '';
            let droppable = true;
  
            // Avoid rendering codes with scripts
            if (content.indexOf('<script') >= 0 && opts.placeholderScript) {
              el.innerHTML = opts.placeholderScript;
              droppable = false;
            }
  
            model.set({ droppable });
          }, 0);
        },
  
        onActive() {
          // @ts-ignore
          const { model, em } = this;
          em.get('Commands').run(commandName, { target: model });
        },
      },
    });
  }

  Components.addType('script', {
    // @ts-ignore
    view: {
      onRender() {
        // @ts-ignore
        const { model, el } = this;
        const isIfCondCC = model.closestType(typeIfCondition);
        const isListCC = model.closestType(typeList);
        const isVariableCC = model.closestType(typeVariable);
        (
          isIfCondCC ||
          isListCC ||
          isVariableCC
        ) && (el.innerHTML = '');
      }
    },
  });

  addComponent({ 
    componentType: typeIfCondition,
    modelName: '#IF Condition',
    modelContent: 'Insert IF Condition here',
    commandName: commandNameIf
  });

  addComponent({ 
    componentType: typeList,
    modelName: '#List',
    modelContent: 'Insert List here',
    commandName: commandNameList
  });

  addComponent({ 
    componentType: typeVariable,
    modelName: '#Variable',
    modelContent: 'Insert your variable here',
    commandName: commandNameVar
  });
}
