module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: '#FFD34D'
        },
        pink: {
          DEFAULT: '#FF8FB1'
        }
      },
      fontFamily: {
        dancing: ['Dancing Script', 'cursive'],
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
}
