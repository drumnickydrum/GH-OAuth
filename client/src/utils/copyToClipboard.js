export const copyToClipboard = (text) => {
  try {
    const dummy = document.createElement('input');
    dummy.id = 'dummyForCopy';
    dummy.value = text;
    dummy.style = 'transform:scale(0);';
    document.body.append(dummy);
    dummy.select();
    dummy.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand('copy');
    document.getElementById('dummyForCopy').remove();
  } catch (e) {
    console.error('copyToClipboard error -> ', e);
  }
};
