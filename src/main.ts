import './style.css';
import { Map, View } from 'ol';
import { Group, Tile } from 'ol/layer';
import { XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { fromWGS84, toWGS84 } from './utils';
import { searchPlace } from './search';

const layersOrto = new Group({
  layers: [
    new Tile({
      preload: Infinity,
      source: new XYZ({
        minZoom: 13,
        maxZoom: 16,
        crossOrigin: 'Anonymous',
        url: 'https://geoportal.b-cdn.net/wss/service/PZGIK/ORTO/REST/StandardResolution/tile/{z}/{y}/{x}',
      }),
    }),
  ],
});

const layersOrtoHigh = new Group({
  layers: [
    new Tile({
      preload: Infinity,
      source: new XYZ({
        minZoom: 13,
        maxZoom: 16,
        crossOrigin: 'Anonymous',
        url: 'https://geoportal.b-cdn.net/wss/service/PZGIK/ORTO/REST/HighResolution/tile/{z}/{y}/{x}',
      }),
    }),
  ],
});

const map = new Map({
  target: 'map',
  layers: [layersOrto],
  view: new View({
    center: fromLonLat([-87.33081, 79.49346]),
    zoom: 13,
    minZoom: 11,
    maxZoom: 18,
  }),
});

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
const searchContainer = document.querySelector('.search-box') as HTMLDivElement;
const rotateControls = document.querySelector('.ol-rotate') as HTMLDivElement;
const zoomControls = document.querySelector('.ol-zoom') as HTMLDivElement;
const zoomLvls: number[] = [11, 11.87, 12.74, 13.61, 14.48, 15.35, 16.22, 17.1, 18];

function setZoom(lvl: number): void {
  map.getView().animate({
    zoom: zoomLvls[lvl],
    duration: 100,
  });
}

function getCenter(): number[] | undefined {
  const center = map.getView().getCenter();
  if (!center) return undefined;
  return toWGS84(center[0], center[1]);
}

function loadCoords(): void {
  const path = location.pathname.slice(1);
  if (!path) return;
  const [lat, lon] = path.split('/').map(parseFloat);
  if (isNaN(lat) || isNaN(lon)) return;
  const point = fromWGS84(lon, lat);
  map.getView().setCenter(point);
}

function onCameraMove(): void {
  const center = getCenter();
  if (!center) return;
  history.replaceState({}, '', `/${center[1].toFixed(5)}/${center[0].toFixed(5)}`);
}

function toggleLayer(): void {
  const layers = map.getLayers();
  const current = layers.getArray()[0];
  if (current === layersOrto) {
    layers.setAt(0, layersOrtoHigh);
  } else {
    layers.setAt(0, layersOrto);
  }
}

function toggleUI(): void {
  const hidden = zoomControls.style.display === 'none';
  zoomControls.style.display = hidden ? 'block' : 'none';
  rotateControls.style.display = hidden ? 'block' : 'none';
  searchContainer.style.display = hidden ? 'flex' : 'none';
}

function takeSnapshot(): void {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (!context) return;
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'map.png';
  link.click();
  link.remove();
}

async function search(): Promise<void> {
  const query = searchInput.value;
  const coords = await searchPlace(query);
  if (!coords) return;
  const point = fromWGS84(coords[0], coords[1]);
  map.getView().setCenter(point);
  searchInput.blur();
}

function onKeyDown({key}: KeyboardEvent): void {
  switch (key) {
    case 'Q':
    case 'q':
      toggleLayer();
      break;
    case 'H':
    case 'h':
      toggleUI();
      break;
    case 'F':
    case 'f':
      searchInput.focus();
      break;
    case 'P':
    case 'p':
      takeSnapshot();
      break;
    case '1':
      setZoom(0);
      break;
    case '2':
      setZoom(1);
      break;
    case '3':
      setZoom(2);
      break;
    case '4':
      setZoom(3);
      break;
    case '5':
      setZoom(4);
      break;
    case '6':
      setZoom(5);
      break;
    case '7':
      setZoom(6);
      break;
    case '8':
      setZoom(7);
      break;
    case '9':
      setZoom(8);
      break;
  }
}

map.on('moveend', onCameraMove);
document.addEventListener('keydown', onKeyDown);
searchButton.addEventListener('click', search);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search();
});
loadCoords();
