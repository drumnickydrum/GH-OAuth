export const copyToClipboard = (text) => {
  try {
    const dummy = document.createElement('input');
    dummy.value = text;
    dummy.style = 'display:none;';
    document.body.append(dummy);
    console.log(dummy.value);
    dummy.select();
    dummy.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand('copy');
    console.log('text copied to clipboard');
  } catch (e) {
    console.error('copyToClipboard error -> ', e);
  }
};
