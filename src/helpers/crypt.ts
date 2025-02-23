export const encryptText = (key: string, text: string, options?: { igonereColumns: number[]; sign?: string }) => {
  if (text.length < 1) return text;
  // Ensure parameters are strings
  key = `${key}`;

  let { igonereColumns, sign: signed } = options || { igonereColumns: [], sign: '' };
  let signature = '';
  let halfSignature = '';
  if (signed && signed.length > key.length) {
    const half = Math.ceil(signed.length / 2);
    signature = encryptText(signed.slice(0, half), signed);
    halfSignature = signature.slice(0, half);
  }

  const random = Math.ceil(Math.random() * Date.now());

  const tokens: { [k: string]: string[] } = {};

  const metadata = {
    textLength: text.length,
    totalLength: 0
  };

  let char = '';
  text = `${signature}${text}?length${text.length}`;
  // Ensure characters in key are unique
  key = key + halfSignature;
  const keyArray = key.split('');
  //  Array.from(new Set(key + halfSignature)).join('');

  const keyLength = key.length;
  for (let i = 0; i < keyLength; i++) {
    char = keyArray[i] = `${i}${key[i]}`;
    tokens[char] = [];
  }
  igonereColumns = Array.from(new Set(igonereColumns));
  const ignored: { [k: string]: boolean } = {};
  for (let i = 0; i < igonereColumns.length; i++) {
    char = keyArray[igonereColumns[i]]; // number or undefined
    ignored[char] = true;
  }

  let cursor = keyLength;
  for (let i = 0, l = text.length; i < l; i++) {
    if (cursor >= keyLength) {
      cursor = 0;
    }
    char = keyArray[cursor++];
    if (ignored[char]) {
      tokens[char].push(text[random % (i + 1)]);
      i--;
    } else {
      tokens[char].push(text[i]);
    }
  }

  // Arrange key in ascending order
  const ascendingKey = keyArray.sort();
  // key.split('').sort();

  // Encrypted transposed text
  let transposedText = '';
  for (let i = 0; i < keyLength; i++) {
    char = ascendingKey[i];
    transposedText += tokens[char].join('');
  }

  metadata.totalLength = transposedText.length;

  // if(signed){
  //     console.log(tokens);
  // }

  return transposedText;
};

const lengthRegexp = /(\?length[1-9][0-9]*)$/;
export const decryptText = (
  key: string,
  text: string,
  options?: { igonereColumns: number[]; sign: string }
) => {
  if (text.length < 1) return { isTrusted: true, text: text };
  // Ensure parameters are strings
  key = `${key}`;

  const { igonereColumns, sign: signed } = options || { igonereColumns: [], sign: '' };
  let signature = '';
  let halfSignature = '';
  if (signed && signed.length > key.length) {
    const half = Math.ceil(signed.length / 2);
    signature = encryptText(signed.slice(0, half), signed);
    halfSignature = signature.slice(0, half);
  }

  text = `${text}`;
  // Ensure characters in key are unique
  key = key + halfSignature;
  const keyArray = key.split('');

  let char = '';

  const ignored: { [k: string]: boolean } = {};
  for (let i = 0; i < key.length; i++) {
    char = keyArray[i] = `${i}${key[i]}`;
    if (igonereColumns.indexOf(i) >= 0) {
      ignored[char] = true;
    }
  }

  // Arrange key in ascending order
  const ascendingKey = keyArray.slice().sort();

  const tokens: { [k: string]: string } = {};
  const keyLength = key.length;
  const textlength = text.length;
  // No padding in encryption,
  // Store how many columns have extra elements or characters than others
  const romColumnDiff = textlength % keyLength;
  // This length of texts gives (n X n) matrix
  const uniformRomColumned = (textlength - romColumnDiff) / keyLength;

  // No padding in encryption,
  // This object will contain columns with extra characters
  const diff: {[k: string]: boolean} = {};
  for (let i = 0; i < romColumnDiff; i++) {
    char = keyArray[i];
    diff[char] = true; // This column has extra character more than other columns
  }

  let cursor = 0;
  // Get all column elements or characters
  for (let i = 0, start = 0; i < keyLength; i++) {
    char = ascendingKey[i];
    start = cursor;
    cursor = diff[char] ? start + uniformRomColumned + 1 : start + uniformRomColumned;
    tokens[char] = text.slice(start, cursor);
  }

  let inversedText = '';

  // Key is already arranged in the right order, hence no re-arrangement of colums in order.
  // Generate rows from columns and concat row elements or characters to form decrypted text
  cursor = 0;
  for (let i = 0, next = 0, length = key.length; i < textlength; i++) {
    if (cursor >= length) {
      cursor = 0;
      next++;
    }
    char = keyArray[cursor++];
    if (!ignored[char]) {
      inversedText += tokens[char][next];
    }
  }

  let isTrusted = inversedText.startsWith(signature) && lengthRegexp.test(inversedText);
  if (isTrusted) {
    let trueLength: any = (inversedText.match(/(\?length[1-9][0-9]*)$/gs) as string[])[0].split('length')[1];
    trueLength = Number(trueLength);
    if (!!trueLength) {
      inversedText = inversedText.replace(signature, '').replace(lengthRegexp, '');
      isTrusted = inversedText.length === trueLength;
    }
  }

  return {
    isTrusted: isTrusted,
    text: isTrusted ? inversedText : ''
  };
};


// const key_2 = 'c0fa1bc00531bd78ef38c628449c5102a28449c5102aeabd49b5dc3a2a516-a2a516ea6e';
// const signature = '28449c5102aeabd49b5dc3a2a516-a2a516ea6ea9.c628449c5102a28449c5102aeabd4'; //
// const ignoredColumns = [0, 7, 4, 11, 3, 33, 22, 18, 44];

// const enc1 = transposeText(key_2, 'I love you', { igonereColumns: ignoredColumns, sign: signature });
// console.log(transposeText(key_2, enc1, { igonereColumns: ignoredColumns, sign: signature }));

// console.log(inverseTransposedText(key_2, enc1, { igonereColumns: ignoredColumns, sign: signature }));
