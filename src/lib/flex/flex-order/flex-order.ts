/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Injectable,
} from '@angular/core';
import {
  BaseDirective,
  MediaChange,
  MediaMonitor,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';

@Injectable({providedIn: 'root'})
export class FlexOrderStyleBuilder extends StyleBuilder {
  buildStyles(value: string) {
    const val = parseInt(value, 10);
    const styles = {order: isNaN(val) ? 0 : val};
    return styles;
  }
}

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive({selector: `
  [fxFlexOrder],
  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],
  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],
  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
`})
export class FlexOrderDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('fxFlexOrder')       set order(val: string)     { this._cacheInput('order', val); }
  @Input('fxFlexOrder.xs')    set orderXs(val: string)   { this._cacheInput('orderXs', val); }
  @Input('fxFlexOrder.sm')    set orderSm(val: string)   { this._cacheInput('orderSm', val); };
  @Input('fxFlexOrder.md')    set orderMd(val: string)   { this._cacheInput('orderMd', val); };
  @Input('fxFlexOrder.lg')    set orderLg(val: string)   { this._cacheInput('orderLg', val); };
  @Input('fxFlexOrder.xl')    set orderXl(val: string)   { this._cacheInput('orderXl', val); };

  @Input('fxFlexOrder.gt-xs') set orderGtXs(val: string) { this._cacheInput('orderGtXs', val); };
  @Input('fxFlexOrder.gt-sm') set orderGtSm(val: string) { this._cacheInput('orderGtSm', val); };
  @Input('fxFlexOrder.gt-md') set orderGtMd(val: string) { this._cacheInput('orderGtMd', val); };
  @Input('fxFlexOrder.gt-lg') set orderGtLg(val: string) { this._cacheInput('orderGtLg', val); };

  @Input('fxFlexOrder.lt-sm') set orderLtSm(val: string) { this._cacheInput('orderLtSm', val); };
  @Input('fxFlexOrder.lt-md') set orderLtMd(val: string) { this._cacheInput('orderLtMd', val); };
  @Input('fxFlexOrder.lt-lg') set orderLtLg(val: string) { this._cacheInput('orderLtLg', val); };
  @Input('fxFlexOrder.lt-xl') set orderLtXl(val: string) { this._cacheInput('orderLtXl', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: FlexOrderStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('order', '0', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected _updateWithValue(value?: string) {
    value = value || this._queryInput('order') || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this.addStyles(value || '');
  }

  protected _styleCache = flexOrderCache;
}

const flexOrderCache: Map<string, StyleDefinition> = new Map();
