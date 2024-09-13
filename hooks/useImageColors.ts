// import { useEffect, useState } from 'react';
// import { getColors } from 'react-native-image-colors';

// export const useImageColors = () => {
//   const initialColors = {
//     background: '#F2DCF1',
//     detail: '#A86C5C',
//     platform: 'ios',
//     primary: '#E62731',
//     secondary: '#7C1128',
//   };
//   const [imageColors, setImageColors] = useState(initialColors);
//   const [url, setUrl] = useState('https://i.imgur.com/68jyjZT.jpg');

//   useEffect(() => {
//     // const url = 'https://i.imgur.com/68jyjZT.jpg';
//     const calcColors = async () => {
//       await getColors(url, {
//         fallback: '#228B22',
//         cache: true,
//         key: url,
//       }).then(setImageColors);
//       console.log('changed image color', imageColors);
//     };
//     calcColors();
//   }, [url]);

//   return { imageColors, setUrl };
// };
