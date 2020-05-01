import { IMenuCmpProps, MenuCmp } from './../components/MenuCmp';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ExtensionMenuBootsrapApplicationCustomizerStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';

const LOG_SOURCE: string = 'ExtensionMenuBootsrapApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IExtensionMenuBootsrapApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ExtensionMenuBootsrapApplicationCustomizer
  extends BaseApplicationCustomizer<IExtensionMenuBootsrapApplicationCustomizerProperties> {
    // These have been added
    private _topPlaceholder: PlaceholderContent | undefined;



    @override
    public onInit(): Promise<void> {
      Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        // Wait for the placeholders to be created (or handle them being changed) and then
    // render.
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        return Promise.resolve<void>();
    }
    private _renderPlaceHolders(): void {
      console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
      console.log(
          "Available placeholders: ",
          this.context.placeholderProvider.placeholderNames
              .map(name => PlaceholderName[name])
              .join(", ")
      );
      if (!this._topPlaceholder) {
        this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
            PlaceholderName.Top,
            { onDispose: this._onDispose }
        );

        // The extension should not assume that the expected placeholder is available.
        if (!this._topPlaceholder) {
            console.error("The expected placeholder (Top) was not found.");
            return;
        }

        if (this.properties) {
            let topString: string = this.properties.Top;
            if (!topString) {
                topString = "(Top property was not defined.)";
            }

            if (this._topPlaceholder.domElement) {
              const element: React.ReactElement<IMenuCmpProps> = React.createElement(MenuCmp,{
                currentContext:this.context
              });
              ReactDom.render(element,this._topPlaceholder.domElement);
            }
        }
    }

    }
    private _onDispose(): void {
      console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }


  }
