export default {
  name: 'SlideUpDown',

  props: {
    active: Boolean,
    duration: {
      type: Number,
      default: 500,
    },
    tag: {
      type: String,
      default: 'div',
    },
    useHidden: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    style: {},
    initial: false,
    hidden: false,
  }),

  watch: {
    active() {
      this.layout()
    },
  },

  render(h) {
    // define the attributes to use
    let attrs = {
      hidden: this.hidden,
      'aria-hidden': !this.active,
      'aria-expanded': this.active,
    }

    if (!this.useHidden) {
      delete attrs.hidden
    }

    // render the component
    return h(
      this.tag,
      {
        style: this.style,
        ref: 'container',
        attrs: attrs,
        on: { transitionend: this.onTransitionEnd },
      },
      this.$slots.default
    )
  },

  mounted() {
    this.layout()
    this.initial = true
  },

  created() {
    this.hidden = !this.active
  },

  computed: {
    el() {
      return this.$refs.container
    },
  },

  methods: {
    layout() {
      if (this.active) {
        this.hidden = false
        this.$emit('open-start')
        if (this.initial) {
          this.setHeight('0px', () => this.el.scrollHeight + 'px')
        }
      } else {
        this.$emit('close-start')
        this.setHeight(this.el.scrollHeight + 'px', () => '0px')
      }
    },

    asap(callback) {
      if (!this.initial) {
        callback()
      } else {
        this.$nextTick(callback)
      }
    },

    setHeight(temp, afterRelayout) {
      this.style = { height: temp }

      this.asap(() => {
        // force relayout so the animation will run
        this.__ = this.el.scrollHeight

        this.style = {
          height: afterRelayout(),
          overflow: 'hidden',
          'transition-property': 'height',
          'transition-duration': this.duration + 'ms',
        }
      })
    },

    onTransitionEnd() {
      if (this.active) {
        this.style = {}
        this.$emit('open-end')
      } else {
        this.style = {
          height: '0',
          overflow: 'hidden',
        }
        this.hidden = true
        this.$emit('close-end')
      }
    },
  },
}
