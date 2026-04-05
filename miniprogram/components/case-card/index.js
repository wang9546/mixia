Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    coverImage: {
      type: String,
      value: ''
    },
    serviceType: {
      type: String,
      value: ''
    },
    viewCount: {
      type: Number,
      value: 0
    },
    collectCount: {
      type: Number,
      value: 0
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap');
    }
  }
});
