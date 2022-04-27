const MIME = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  HEIC: 'image/heic',
  APNG: 'image/apng',
  UNKNOWN: 'application/octet-stream',
} as const;

const MAGIG_NUMBER = {
  [MIME.PNG]: [0x89, 0x50, 0x4e, 0x47], // .PNG
  [MIME.JPEG]: [0xff, 0xd8],
  [MIME.GIF]: [0x47, 0x49, 0x46, 0x38],
  [MIME.HEIC]: [0x00, 0x00, 0x00, 0x28, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], // '   (ftypheic'
} as { [mime: string]: number[] };

const EXT = {
  [MIME.PNG]: 'png',
  [MIME.JPEG]: 'jpeg',
  [MIME.GIF]: 'gif',
  [MIME.HEIC]: 'heic',
  [MIME.APNG]: 'apng',
  [MIME.UNKNOWN]: '',
} as { [mime: string]: string };

const getMimeType = (raw: Uint8Array): string => {
  const keys = Object.keys(MAGIG_NUMBER);
  for (let i = 0; i < keys.length; i++) {
    const mime = keys[i];
    const magic = MAGIG_NUMBER[mime];
    let equal = true;
    for (let i = 0; i < magic.length; i++) {
      if (magic[i] !== raw[i]) {
        equal = false;
        break;
      }
    }

    if (equal) {
      return mime;
    }
  }

  return MIME.UNKNOWN;
};
