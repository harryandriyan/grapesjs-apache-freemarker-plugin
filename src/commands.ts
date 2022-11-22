import type grapesjs from 'grapesjs';
import { PluginOptions } from '.';
import {
  keyCustomCode,
  commandNameIf,
  commandNameList,
  commandNameVar,
} from './utils';

export default (editor: grapesjs.Editor, opts: PluginOptions = {}) => {
  const { modalTitle, codeViewOptions, commandCustomCode } = opts;

  const appendToContent = (target: HTMLElement, content: HTMLElement | string) => {
    if (content instanceof HTMLElement) {
      target.appendChild(content);
    } else if (content) {
      target.insertAdjacentHTML('beforeend', content);
    }
  }

  const addCommand = (commandName: string) => {
    const getInitCode = (commandParam: string) => {
      let initCode = '';
      switch (commandParam) {
        case commandNameIf:
            initCode = `[#if condition]<div></div>[/#if]`
          break;
        case commandNameList:
            initCode = `[#list sequence as item]<div></div>[/#list]`
          break;
        case commandNameVar:
            initCode = '${varName}'
          break;
      
        default:
          break;
      }

      return initCode;
    }

    return editor.Commands.add(commandName, {
      // @ts-ignore
      keyCustomCode,
  
      // @ts-ignore
      run(editor, s, opts = {}) {
        // @ts-ignore
        const target = opts.target || editor.getSelected();
        // @ts-ignore
        this.target = target;
  
        if (target?.get('editable')) {
          // @ts-ignore
          this.showCustomCode(target, opts);
        }
      },
  
      // @ts-ignore
      stop(editor) {
        editor.Modal.close();
      },
  
      /**
       * Method which tells how to show the custom code
       * @param  {Component} target
       */
      showCustomCode(target: grapesjs.Component, options: any) {
        const title = options.title || modalTitle;
        const initCode = getInitCode(commandName);
        const code = target.get(keyCustomCode) || initCode;
        // @ts-ignore
        const content = this.getContent();
        editor.Modal
          .open({ title, content })
          // @ts-ignore
          .onceClose(() => editor.stopCommand(commandName))
        // @ts-ignore
        this.getCodeViewer().setContent(code);
      },
  
      /**
       * Custom pre-content. Can be a simple string or an HTMLElement
       */
      getPreContent() {},
  
      /**
       * Custom post-content. Can be a simple string or an HTMLElement
       */
      getPostContent() {},
  
      /**
       * Get all the content for the custom code
       * @return {HTMLElement}
       */
      getContent() {
        // @ts-ignore
        const codeViewer = this.getCodeViewer();
        const content = document.createElement('div');
        const pfx = editor.getConfig('stylePrefix');
        content.className = `${pfx}custom-code`;
        // @ts-ignore
        appendToContent(content, this.getPreContent());
        content.appendChild(codeViewer.getElement());
        // @ts-ignore
        appendToContent(content, this.getPostContent());
        // @ts-ignore
        appendToContent(content, this.getContentActions());
        codeViewer.refresh();
        setTimeout(()=> codeViewer.focus(), 0);
  
        return content;
      },
  
      /**
       * Get the actions content. Can be a simple string or an HTMLElement
       * @return {HTMLElement|String}
       */
      getContentActions() {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        const pfx = editor.getConfig('stylePrefix');
        btn.innerHTML = opts.buttonLabel!;
        btn.className = `${pfx}btn-prim ${pfx}btn-import__custom-code`;
        // @ts-ignore
        btn.onclick = () => this.handleSave();
  
        return btn;
      },
  
      /**
       * Handle the main save task
       */
      handleSave() {
        // @ts-ignore
        const { target } = this;
        // @ts-ignore
        const code = this.getCodeViewer().getContent();
        target.set(keyCustomCode, code);
        editor.Modal.close();
      },
  
      /**
       * Return the code viewer instance
       * @return {CodeViewer}
       */
      getCodeViewer() {
        // @ts-ignore
        if (!this.codeViewer) {
          // @ts-ignore
          this.codeViewer = editor.CodeManager.createViewer({
            codeName: 'htmlmixed',
            theme: 'hopscotch',
            readOnly: 0,
            ...codeViewOptions,
          });
        }
        // @ts-ignore
        return this.codeViewer;
      },
  
      ...commandCustomCode,
    });
  }

  addCommand(commandNameIf)
  addCommand(commandNameList)
  addCommand(commandNameVar)
  
};
