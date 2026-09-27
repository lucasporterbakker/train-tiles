// Tidy the "Kitchen mosaic variants" canvas into labelled sections.
// Run in Figma with the free "Scripter" plugin: open the file, Plugins > Scripter, paste, press Run.
const page = figma.currentPage;
const kids = [...page.children];
const groups = [
  ['Templates (25 x 57 panels)', n => n.name.startsWith('Variant /')],
  ['Canadiana 2x2 squares', n => n.name.startsWith('Canadiana /')],
  ['FS board 5x5 cm squares', n => n.name.startsWith('FS board /')],
  ['Eurotile 2x2 squares', n => n.name.startsWith('Eurotile /')],
  ['Eurotile hexagons', n => n.name.startsWith('Eurotile hex /')],
];
const notes = {
  1: '6x6 per 12in sheet: 1 7/8in tile, 1/8in joint. Mudroom 74 x 101 in. 36 x 49 full tiles + edge cuts.',
  2: 'Assumes 2in sheet repeat. Confirm sheet size.',
  3: '6x6 per 12in sheet: 1 7/8in tile, 1/8in joint. Mudroom 74 x 101 in.',
  4: 'Assumes 2in repeat across flats.',
};
kids.filter(n => n.type === 'TEXT').forEach(t => t.remove());
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
let y = 0;
for (let g = 0; g < groups.length; g++) {
  const [title, test] = groups[g];
  const fr = kids.filter(n => n.type === 'FRAME' && test(n)).sort((a, b) => (a.y - b.y) || (a.x - b.x));
  if (!fr.length) continue;
  const w = fr[0].width, h = fr[0].height, gap = 800, pad = 1200, cols = g === 0 ? 7 : 5, head = 1400;
  const rows = Math.ceil(fr.length / cols);
  const SW = pad * 2 + cols * w + (cols - 1) * gap;
  const SH = pad + head + rows * h + (rows - 1) * (gap + 500) + pad;
  const s = figma.createSection();
  s.name = title; s.x = 0; s.y = y;
  s.resizeWithoutConstraints(SW, SH);
  if (notes[g]) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: 'Medium' };
    t.fontSize = 320; t.characters = notes[g];
    s.appendChild(t); t.x = pad; t.y = pad - 200;
  }
  fr.forEach((f, i) => {
    s.appendChild(f);
    f.x = pad + (i % cols) * (w + gap);
    f.y = pad + head - 400 + Math.floor(i / cols) * (h + gap + 500);
  });
  y += SH + 2000;
}
figma.viewport.scrollAndZoomIntoView(page.children);
