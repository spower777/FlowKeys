export type KeyboardLayout = 'qwerty' | 'dvorak' | 'colemak' | 'qwertz'

export interface LayoutDefinition {
  label: string
  rows: string[][]
  finger: Record<string, string>
}

export const LAYOUTS: Record<KeyboardLayout, LayoutDefinition> = {
  qwerty: {
    label: 'QWERTY',
    rows: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['z','x','c','v','b','n','m'],
    ],
    finger: {
      '1':'lp','q':'lp','a':'lp','z':'lp',
      '2':'lr','w':'lr','s':'lr','x':'lr',
      '3':'lm','e':'lm','d':'lm','c':'lm',
      '4':'li','5':'li','r':'li','t':'li','f':'li','g':'li','v':'li','b':'li',
      '6':'ri','7':'ri','y':'ri','u':'ri','h':'ri','j':'ri','n':'ri','m':'ri',
      '8':'rm','i':'rm','k':'rm',',':'rm',
      '9':'rr','o':'rr','l':'rr','.':'rr',
      '0':'rp','p':'rp',';':'rp',"'":'rp','/':'rp',
      ' ':'th',
    },
  },

  dvorak: {
    label: 'Dvorak',
    rows: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ["'",',','.','p','y','f','g','c','r','l'],
      ['a','o','e','u','i','d','h','t','n','s'],
      [';','q','j','k','x','b','m','w','v','z'],
    ],
    finger: {
      '1':'lp',"'":'lp','a':'lp',';':'lp',
      '2':'lr',',':'lr','o':'lr','q':'lr',
      '3':'lm','.':'lm','e':'lm','j':'lm',
      '4':'li','5':'li','p':'li','y':'li','u':'li','i':'li','k':'li','x':'li',
      '6':'ri','7':'ri','f':'ri','g':'ri','d':'ri','h':'ri','b':'ri','m':'ri',
      '8':'rm','c':'rm','t':'rm','w':'rm',
      '9':'rr','r':'rr','n':'rr','v':'rr',
      '0':'rp','l':'rp','s':'rp','z':'rp',
      ' ':'th',
    },
  },

  colemak: {
    label: 'Colemak',
    rows: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ['q','w','f','p','g','j','l','u','y',';'],
      ['a','r','s','t','d','h','n','e','i','o'],
      ['z','x','c','v','b','k','m'],
    ],
    finger: {
      '1':'lp','q':'lp','a':'lp','z':'lp',
      '2':'lr','w':'lr','r':'lr','x':'lr',
      '3':'lm','f':'lm','s':'lm','c':'lm',
      '4':'li','5':'li','p':'li','g':'li','t':'li','d':'li','v':'li','b':'li',
      '6':'ri','7':'ri','j':'ri','h':'ri','n':'ri','k':'ri',
      '8':'rm','l':'rm','e':'rm','m':'rm',
      '9':'rr','u':'rr','i':'rr',
      '0':'rp','y':'rp',';':'rp','o':'rp',
      ' ':'th',
    },
  },

  qwertz: {
    label: 'QWERTZ',
    rows: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ['q','w','e','r','t','z','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['y','x','c','v','b','n','m'],
    ],
    finger: {
      '1':'lp','q':'lp','a':'lp','y':'lp',
      '2':'lr','w':'lr','s':'lr','x':'lr',
      '3':'lm','e':'lm','d':'lm','c':'lm',
      '4':'li','5':'li','r':'li','t':'li','f':'li','g':'li','v':'li','b':'li',
      '6':'ri','7':'ri','z':'ri','u':'ri','h':'ri','j':'ri','n':'ri','m':'ri',
      '8':'rm','i':'rm','k':'rm',',':'rm',
      '9':'rr','o':'rr','l':'rr','.':'rr',
      '0':'rp','p':'rp',';':'rp',
      ' ':'th',
    },
  },
}
