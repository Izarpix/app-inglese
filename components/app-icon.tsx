import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

/**
 * Small, local SVG icon set for the app shell.
 *
 * These deliberately do not use an icon font. Safari's installed PWAs can
 * cache a failed font request and then render every glyph as an empty square.
 * SVG paths travel in the JavaScript bundle instead, so every iPhone receives
 * the same icons.
 */
export function AppIcon({ name, size = 22, color = '#102A43', strokeWidth = 2.2 }: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const icon = (() => {
    switch (name) {
      case 'cards': case 'cards-outline': return <><Rect x="5" y="6" width="12" height="15" rx="2" {...common}/><Path d="M9 4h10a2 2 0 0 1 2 2v12" {...common}/><Path d="m9 10 4 3 3-2 3 3" {...common}/></>;
      case 'book-open-page-variant': case 'book-open-variant': return <><Path d="M4 6c4-2 7-1 8 1v12c-2-2-5-3-8-1zM20 6c-4-2-7-1-8 1v12c2-2 5-3 8-1z" {...common}/><Line x1="12" y1="7" x2="12" y2="19" {...common}/></>;
      case 'trophy': return <><Path d="M7 4h10v6a5 5 0 0 1-10 0zM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4M12 15v4M8 21h8" {...common}/></>;
      case 'account-circle': return <><Circle cx="12" cy="12" r="9" {...common}/><Circle cx="12" cy="9" r="3" {...common}/><Path d="M6.5 19c1.4-3 3.2-4.5 5.5-4.5S16.1 16 17.5 19" {...common}/></>;
      case 'shuffle-variant': return <><Path d="M4 7h3c4 0 5 10 9 10h4M20 14l3 3-3 3M4 17h3c1.7 0 2.8-1.8 4-4M16 7h4M20 4l3 3-3 3" {...common}/></>;
      case 'timer-sand': case 'timer-outline': return <><Path d="M6 3h12M6 21h12M7 3c0 5 4 5 5 9 1 4 5 4 5 9M17 3c0 5-4 5-5 9-1 4-5 4-5 9" {...common}/></>;
      case 'format-list-bulleted': case 'format-list-numbered': return <><Line x1="9" y1="6" x2="20" y2="6" {...common}/><Line x1="9" y1="12" x2="20" y2="12" {...common}/><Line x1="9" y1="18" x2="20" y2="18" {...common}/><Circle cx="5" cy="6" r="1" fill={color}/><Circle cx="5" cy="12" r="1" fill={color}/><Circle cx="5" cy="18" r="1" fill={color}/></>;
      case 'format-list-checks': return <><Polyline points="3,6 5,8 8,4" {...common}/><Polyline points="3,13 5,15 8,11" {...common}/><Line x1="11" y1="6" x2="21" y2="6" {...common}/><Line x1="11" y1="13" x2="21" y2="13" {...common}/><Line x1="11" y1="20" x2="21" y2="20" {...common}/></>;
      case 'form-textbox': return <><Rect x="3" y="4" width="18" height="16" rx="2" {...common}/><Line x1="7" y1="9" x2="17" y2="9" {...common}/><Line x1="7" y1="13" x2="14" y2="13" {...common}/><Line x1="7" y1="17" x2="12" y2="17" {...common}/></>;
      case 'text-box-search-outline': return <><Rect x="4" y="3" width="14" height="18" rx="2" {...common}/><Line x1="7" y1="8" x2="14" y2="8" {...common}/><Line x1="7" y1="12" x2="13" y2="12" {...common}/><Circle cx="17" cy="17" r="3.5" {...common}/><Line x1="19.5" y1="19.5" x2="22" y2="22" {...common}/></>;
      case 'newspaper-variant-outline': return <><Rect x="3" y="5" width="18" height="15" rx="1" {...common}/><Rect x="6" y="8" width="5" height="5" {...common}/><Line x1="13" y1="9" x2="18" y2="9" {...common}/><Line x1="13" y1="12" x2="18" y2="12" {...common}/><Line x1="6" y1="16" x2="18" y2="16" {...common}/></>;
      case 'pencil-ruler': return <><Path d="m4 20 4-1 10-10-3-3L5 16zM14 5l3 3" {...common}/><Line x1="4" y1="5" x2="10" y2="5" {...common}/><Line x1="4" y1="8" x2="8" y2="8" {...common}/></>;
      case 'image-outline': return <><Rect x="3" y="4" width="18" height="16" rx="2" {...common}/><Circle cx="9" cy="9" r="1.5" {...common}/><Path d="m5 18 5-5 3 3 2-2 4 4" {...common}/></>;
      case 'book-alphabet': return <><Path d="M4 5c3-1 6 0 8 2v12c-2-2-5-3-8-2zM20 5c-3-1-6 0-8 2v12c2-2 5-3 8-2z" {...common}/><Path d="m15 9 2 5M16 12h2" {...common}/></>;
      case 'chart-line': return <><Line x1="4" y1="20" x2="20" y2="20" {...common}/><Line x1="4" y1="20" x2="4" y2="5" {...common}/><Polyline points="6,16 10,12 13,14 19,7" {...common}/></>;
      case 'school': return <><Path d="m3 10 9-5 9 5-9 5zM7 13v4c3 2 7 2 10 0v-4M21 11v5" {...common}/></>;
      case 'table-large': return <><Rect x="3" y="4" width="18" height="16" rx="1" {...common}/><Line x1="3" y1="10" x2="21" y2="10" {...common}/><Line x1="3" y1="15" x2="21" y2="15" {...common}/><Line x1="10" y1="4" x2="10" y2="20" {...common}/></>;
      case 'lightbulb-on-outline': return <><Path d="M8 15c-1.5-1.2-2.5-3-2.5-5A6.5 6.5 0 0 1 12 3.5a6.5 6.5 0 0 1 6.5 6.5c0 2-1 3.8-2.5 5-.8.7-1.2 1.2-1.2 2H9.2c0-.8-.4-1.3-1.2-2zM9 20h6M10 23h4" {...common}/></>;
      case 'arrow-right': return <><Line x1="4" y1="12" x2="20" y2="12" {...common}/><Polyline points="14,6 20,12 14,18" {...common}/></>;
      case 'arrow-left': return <><Line x1="20" y1="12" x2="4" y2="12" {...common}/><Polyline points="10,6 4,12 10,18" {...common}/></>;
      case 'chevron-right': return <Polyline points="9,5 16,12 9,19" {...common}/>;
      case 'magnify': return <><Circle cx="10.5" cy="10.5" r="5.5" {...common}/><Line x1="15" y1="15" x2="20" y2="20" {...common}/></>;
      case 'cog-outline': return <><Circle cx="12" cy="12" r="3" {...common}/><Path d="M19 13.5v-3l-2-.6a7 7 0 0 0-.8-1.8l1-1.8-2.1-2.1-1.8 1.1a7 7 0 0 0-1.8-.8L11 2h-3l-.6 2.5a7 7 0 0 0-1.8.8L3.8 4.2 1.7 6.3l1.1 1.8A7 7 0 0 0 2 9.9l-2 .6v3l2 .6a7 7 0 0 0 .8 1.8l-1.1 1.8 2.1 2.1 1.8-1.1a7 7 0 0 0 1.8.8L8 22h3l.6-2.5a7 7 0 0 0 1.8-.8l1.8 1.1 2.1-2.1-1.1-1.8a7 7 0 0 0 .8-1.8z" transform="translate(1 0) scale(.91)" {...common}/></>;
      case 'folder-outline': return <Path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...common}/>;
      case 'tag-outline': return <Path d="M4 5v6l9 9 7-7-9-9zM8 8h.01" {...common}/>;
      case 'cloud-check-outline': return <><Path d="M7 18H6a4 4 0 0 1-.2-8A6.5 6.5 0 0 1 18 8.5 4.5 4.5 0 0 1 18 18h-2" {...common}/><Polyline points="9,14 11,16 15,12" {...common}/></>;
      case 'update': return <><Path d="M20 11a8 8 0 1 0 1 4" {...common}/><Polyline points="20,4 20,11 13,11" {...common}/></>;
      case 'passport': return <><Rect x="5" y="3" width="14" height="18" rx="2" {...common}/><Circle cx="12" cy="11" r="3" {...common}/><Line x1="8" y1="17" x2="16" y2="17" {...common}/></>;
      case 'plus': return <><Line x1="12" y1="5" x2="12" y2="19" {...common}/><Line x1="5" y1="12" x2="19" y2="12" {...common}/></>;
      case 'close': return <><Line x1="6" y1="6" x2="18" y2="18" {...common}/><Line x1="18" y1="6" x2="6" y2="18" {...common}/></>;
      case 'check': return <Polyline points="5,12 10,17 20,6" {...common}/>;
      default: return <Circle cx="12" cy="12" r="8" {...common}/>;
    }
  })();
  return <Svg width={size} height={size} viewBox="0 0 24 24">{icon}</Svg>;
}
