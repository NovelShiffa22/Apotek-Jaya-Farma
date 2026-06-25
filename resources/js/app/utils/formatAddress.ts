export const formatAddress = (address: any): string => {
  if (!address) return 'Alamat belum diatur';
  if (typeof address === 'object') {
    const { alamat_lengkap = '', kota = '', provinsi = '' } = address;
    return `${alamat_lengkap}, ${kota}, ${provinsi}`.replace(/^, |, $/g, '').trim();
  }
  if (typeof address === 'string' && address.trim()) {
    try {
      const obj = JSON.parse(address);
      const { alamat_lengkap = '', kota = '', provinsi = '' } = obj;
      return `${alamat_lengkap}, ${kota}, ${provinsi}`.replace(/^, |, $/g, '').trim();
    } catch {
      return address;
    }
  }
  return 'Alamat belum diatur';
};
