// Local content source — the single source of truth until Strapi is wired in.
// Order on the site comes from each entry's `order` field, not this list.
import x36 from './36x';
import garageflow from './garageflow';
import ckDarji from './ck-darji';
import firstmerge from './firstmerge';
import ladeDigital from './lade-digital';
import archive from './archive';

const projects = [x36, garageflow, ckDarji, firstmerge, ladeDigital, ...archive];

export default projects;
