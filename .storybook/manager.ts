import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'

addons.register('force-default-story', () => {
  addons.getChannel().on('storyRendered', () => {
    const hash = window.location.hash
    if (!hash || hash === '#/') {
      window.location.hash = '#/components-actionwidget--running' // adjust to your story id
    }
  })
})

addons.setConfig({
  theme: themes.dark,
})
