import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Autonomy Widget',
    brandUrl: '/?path=/docs/overview--docs',
    brandTarget: '_self',
  },
})
