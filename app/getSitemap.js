'use strict';

import { renderToString } from 'vue/server-renderer';
import fetch from 'node-fetch';
import { createSitemap } from './sitemapApp.js';
import ejs from 'ejs';

const ROOT_URL = `https://cms-chesheast.cloud.contensis.com/`;
const PROJECT = 'website';

async function getSitemap(req, res, contentType) {
  const resp = await fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/contenttypes/${contentType}/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I`,
    { method: 'get' }
  );

  // Abort if no data from the CMS.
  if (resp.status !== 200) {
    res.sendStatus(resp.status);
    return;
  }

  const data = await resp.json();
  const app = createSitemap(data.items, contentType);
  renderToString(app).then((html) => {
    let xml = ejs.render('<%- html %>', { html: html });
    xml = xml.replace(/<!--.-->/g, '');
    xml = xml.replace(/div(.)/g, 'urlset$1');
    xml = xml.replace(/p>/g, 'url>');
    xml = xml.replace(/b>/g, 'lastmod>');
    xml = xml.replace(/i>/g, 'changefreq>');
    xml = xml.replace(/a>/g, 'loc>');
    res.set('Content-Type', 'application/xml');
    res.send(xml);
    return;
  });
}

export default getSitemap;
