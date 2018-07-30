import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-product-attribution',
  templateUrl: './product-attribution.component.html',
  styleUrls: ['./product-attribution.component.scss']
})
export class ProductAttributionComponent {


  @Input() product: any;


  /**
   * Returns sources from product input
   * @param product
   * @returns {Array<string>}
   */
  getSources (product: any): Array<string> {
    const sources = new Set<string>();

    if (!product) {
      return [];
    }

    if (product.source) {
      sources.add(product.source.toLowerCase());
    }

    if (product.properties) {
      [
        'origin-source',
        'magnitude-source',
        'beachball-source'
      ].forEach((prop) => {
        if (product.properties[prop]) {
          sources.add(product.properties[prop].toLowerCase());
        }
      });
    }

    return Array.from(sources);
  }

}
