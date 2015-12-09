'use strict';

var Attribution = require('./Attribution'),
    BeachBall = require('scientific/tensor/BeachBall'),
    EventModulePage = require('./EventModulePage'),
    Formatter = require('./Formatter'),
    ImpactUtil = require('./ImpactUtil'),
    Tensor = require('scientific/tensor/Tensor');


var _getDYFISummary,
  _getFiniteFaultSummary,
  _getFocalMechanismSummary,
  _getLossPAGERSummary,
  _getMomentTensorSummary,
  _getOriginProducts,
  _getOriginSummary,
  _getShakeMapSummary,

  getProductSummary;

var _formatter = new Formatter();


_getDYFISummary = function (product) {
  var properties = product.properties,
      contents = product.contents,
      eventId = properties.eventsource + properties.eventsourcecode,
      maxmmi = properties.maxmmi,
      thumbnail;

  maxmmi = ImpactUtil.translateMmi(maxmmi);
  thumbnail = contents[eventId + '_ciim.jpg'];

  return '<ul>' +
      '<li class="impact-bubbles">' +
        '<span class="mmi' + maxmmi + '">' +
          '<strong class="roman">' + maxmmi + '</strong>' +
          '<br/>' +
          '<abbr title="Community Determined Intensity">CDI</abbr>' +
        '</span>' +
      '</li>' +
      '<li>' +
        '<span>' + properties['num-responses'] + '</span>' +
        '<abbr title="Number of Responses">Responses</abbr>' +
      '</li>' +
    '</ul>';
};

_getFiniteFaultSummary = function (product) {
  var basemap;

  basemap = product.contents['basemap.png'];

  return '<ul>' +
      '<li class="image">' +
        '<img src="' + basemap.url + '" alt="Finite Fault" />' +
      '</li>' +
      '<li>' +
        Attribution.getContributorReference(product.source) +
        '<abbr title="Finite Fault Data Source">Source</abbr>' +
      '</li>' +
    '</ul>';
};

_getFocalMechanismSummary = function (product) {
  var beachBall,
      np1,
      np2,
      source,
      tensor;

  tensor = Tensor.fromProduct(product);

  if (tensor !== null) {
    np1 = tensor.NP1;
    np2 = tensor.NP2;
    source = tensor.source;
  } else {
    source = product.source;
  }

  beachBall = new BeachBall({
    tensor: tensor,
    size: 200,
    plotAxes: false,
    plotPlanes: true,
    fillColor: tensor.fillColor,
  }).getCanvas().toDataURL();

  return [
        '<ul>',
          '<li class="image">',
            '<img src="', beachBall, '" ',
                'alt="Focal Mechanism Beachball (' + tensor.code + ')"/>',
          '</li>',
          '<li class="wider">',
            '<span>',
              '(',
              (np1 ?
                  Math.round(np1.strike) + '<i>,</i>' +
                  Math.round(np1.dip) + '<i>,</i>' +
                  Math.round(np1.rake) :
                  '&ndash;'),
              ')',
            '</span>',
            '<abbr title="Nodal Plane 1">',
              'Strike<i>,</i>Dip<i>,</i>Rake</abbr>',
            '</abbr>',
          '</li>',
          '<li class="wider">',
            '<span>',
              '(',
              (np2 ?
                  Math.round(np2.strike) + '<i>,</i>' +
                  Math.round(np2.dip) + '<i>,</i>' +
                  Math.round(np2.rake) :
                  '&ndash;'),
              ')',
            '</span>',
            '<abbr title="Nodal Plane 2">',
              'Strike<i>,</i>Dip<i>,</i>Rake</abbr>',
            '</abbr>',
          '</li>',
          '<li>',
            Attribution.getContributorReference(source),
            '<abbr title="', Attribution.getName(source),
                '">Source</abbr>',
          '</li>',
        '</ul>',
  ].join('');
};

_getLossPAGERSummary = function (product) {
  var alertlevel,
      properties;

  properties = product.properties || {};
  alertlevel = properties.alertlevel;

  return '<ul>' +
      '<li class="impact-bubbles">' +
        '<span class="pager-alertlevel-' + alertlevel + '">' +
          '<strong class="roman">' + alertlevel.toUpperCase() + '</strong>' +
          '<br/>' +
          '<abbr title="Alert Level">Alert</abbr>' +
        '</span>' +
      '</li>' +
    '</ul>';
};

_getMomentTensorSummary = function (product) {  var beachBall,
      code,
      depth,
      magnitude,
      percentDC,
      source,
      tensor,
      type;

  tensor = Tensor.fromProduct(product);
  if (tensor !== null) {
    type = tensor.type;
    source = tensor.source;
    code = tensor.code;
    magnitude = tensor.magnitude;
    magnitude = _formatter.magnitude(magnitude);
    depth = Math.round(tensor.depth);
    percentDC = Math.round(tensor.percentDC * 100);
  } else {
    type = '&ndash;';
    magnitude = '&ndash;';
    depth = '&ndash;';
    percentDC = '&ndash;';
    source = product.source;
    code = product.code;
  }

  beachBall = new BeachBall({
    tensor: tensor,
    size: 200,
    plotAxes: false,
    plotPlanes: true,
    fillColor: tensor.fillColor,
  }).getCanvas().toDataURL();

  return [
        '<ul>',
          '<li class="image">',
            (tensor !== null ?
                '<img src="' + beachBall + '" ' +
                    'alt="Moment Tensor Beachball (' + code + ')"/>' :
                code),
          '</li>',
          '<li>',
            '<span>', type, '</span>',
            '<abbr title="Tensor Type">Type</abbr>',
          '</li>',
          '<li>',
            '<span>', magnitude, '</span>',
            '<abbr title="Magnitude">Mag</abbr>',
          '</li>',
          '<li>',
            '<span>', depth, '<span class="units">km</span></span>',
            '<abbr title="Depth (km)">Depth</abbr>',
          '</li>',
          '<li>',
            '<span>', percentDC, '</span>',
            '<abbr title="Percent Double Couple">% DC</abbr>',
          '</li>',
          '<li>',
            Attribution.getContributorReference(source),
            '<abbr title="Moment Tensor Data Source">Source</abbr>',
          '</li>',
        '</ul>'
  ].join('');
};

/**
 * Determines the product to use as the "origin" product for this event.
 *
 * If both phase-data and origin product exist, use the most recently updated
 * product as the "origin" product.
 *
 * If only one of phase-data or origin product exist, use it as the "origin"
 * product.
 *
 * If neither product exists (unlikely), then assume no "origin" product.
 *
 * @param products {Object}
 *      An object keyed by product type whose corresponding values are an
 *      array of products of that type in descending preferrred-ness order.
 *
 * @return {Array}
 *      An array of origin-like products in descending preferred order.
 */
_getOriginProducts = function (products) {
  var index,
      originProducts,
      originSourceCodes,
      phaseProducts,
      phaseSourceCode;

  originSourceCodes = [];

  try {
    originProducts = products.origin.slice(0);
    phaseProducts = products['phase-data'];

    if (!phaseProducts) {
      return originProducts;
    }

    // Build list of origin ids for lookup later
    originSourceCodes = originProducts.map(function (origin) {
      return origin.source + '_' + origin.code;
    });

    // Look at phase data products, if an older corresponding origin exists,
    // replace it with the phase data product instead, otherwise append phase
    // data product to list of origins
    phaseProducts.forEach(function (phaseData) {
      phaseSourceCode = phaseData.source + '_' + phaseData.code;
      index = originSourceCodes.indexOf(phaseSourceCode);

      if (index === -1) {
        originProducts.push(phaseData);
        originSourceCodes.push(phaseSourceCode);
      } else if (originProducts[index].updateTime <= phaseData.updateTime) {
        originProducts[index] = phaseData;
      }
    });
  } catch (e) {
    originProducts = [];
  } finally {
    return originProducts;
  }
};

_getOriginSummary = function (product) {
  var p,
      depth,
      magnitude,
      magnitudeType,
      originSource,
      magnitudeSource;

  if (!product) {
    return '<p class="alert error">No origin product found for this event.</p>';
  }

  p = product.properties;
  depth = p.depth;
  magnitude = p.magnitude;
  magnitudeType = p['magnitude-type'];
  originSource = p['origin-source'] || product.source;
  magnitudeSource = p['magnitude-source'] || product.source;


  return '<ul>' +
        '<li>' +
          '<span>' + magnitude + '</span>' +
          '<abbr title="Magnitude">Mag</abbr>' +
        '</li>' +
        '<li>' +
          '<span>' + magnitudeType + '</span>' +
          '<abbr title="Magnitude Type">Type</abbr>' +
        '</li>' +
        '<li>' +
          '<span>' + depth + '</span>' +
          '<abbr title="Depth (km)">Depth</abbr>' +
        '</li>' +
        '<li>' +
          EventModulePage.prototype.getCatalogSummary.call(null, product) +
        '</li>' +
        '<li>' +
          (originSource === magnitudeSource ?
            Attribution.getContributorReference(originSource) :
            '<span>' +
              Attribution.getContributorReference(originSource) + ', ' +
              Attribution.getContributorReference(magnitudeSource) +
            '</span>') +
          '<abbr title="Location and Magnitude Data Source">Source</abbr>' +
        '</li>' +
      '</ul>';
};

_getShakeMapSummary = function (product) {
  var properties = product.properties,
      contents = product.contents,
      maxmmi = properties.maxmmi,
      thumbnail;

  maxmmi = ImpactUtil.translateMmi(maxmmi);
  thumbnail = contents['download/intensity.jpg'];

  return '<ul>' +
      '<li class="impact-bubbles">' +
        '<span class="mmi' + maxmmi + '">' +
          '<strong class="roman">' + maxmmi + '</strong>' +
          '<br/>' +
          '<abbr title="Modified Mercalli Intenisty">MMI</abbr>' +
        '</span>' +
      '</li>' +
      '<li>' +
        '<span>' + _formatter.magnitude(properties.magnitude) + '</span>' +
        '<abbr title="Magnitude">Mag</abbr>' +
      '</li>' +
      '<li>' +
        EventModulePage.prototype.getCatalogSummary.call(null, product) +
      '</li>' +
      '<li>' +
        Attribution.getContributorReference(product.source) +
        '<abbr title="ShakeMap Data Source">Source</abbr>' +
      '</li>' +
    '</ul>';
};


getProductSummary = function (type, hash, name, eventDetails) {
  var allProducts,
      products,
      summary;

  allProducts = eventDetails.properties.products;
  summary = [];
  products = allProducts[type];

  if (type === 'origin' || type === 'phase-data') {
    products = _getOriginProducts(allProducts);
    summary = _getOriginSummary(products[0]);
  } else if (type === 'dyfi') {
    summary = _getDYFISummary(products[0]);
  } else if (type === 'shakemap') {
    summary = _getShakeMapSummary(products[0]);
  } else if (type === 'losspager') {
    summary = _getLossPAGERSummary(products[0]);
  } else if (type === 'moment-tensor') {
    summary = _getMomentTensorSummary(products[0]);
  } else if (type === 'focal-mechanism') {
    summary = _getFocalMechanismSummary(products[0]);
  } else if (type === 'finite-fault') {
    summary = _getFiniteFaultSummary(products[0]);
  }

  if (summary) {
    return [
      '<h3>', name, '</h3>',
      '<a href="#', hash, '" class="horizontal-scrolling ',
          type, '-summary summary">',
        summary,
      '</a>'
    ].join('');
  } else {
    return '<p class="alert warning">' +
        'No product summary for product type &ldquo;' + type + '&rdquo;</p>';
  }
};


module.exports = {
  getProductSummary: getProductSummary,

  getDYFISummary: _getDYFISummary,
  getFiniteFaultSummary: _getFiniteFaultSummary,
  getFocalMechanismSummary: _getFocalMechanismSummary,
  getLossPAGERSummary: _getLossPAGERSummary,
  getMomentTensorSummary: _getMomentTensorSummary,
  getOriginSummary: _getOriginSummary,
  getShakeMapSummary: _getShakeMapSummary
};
