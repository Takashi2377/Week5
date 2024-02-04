export default {
  template: "#userProductModal",
  props: ["product", "addToCart", "loading"],
  data() {
    return {
      productModal: "",
      qty: 1,
    };
  },
  methods: {
    openModal() {
      this.productModal.show();
    },
    closeModal() {
      this.productModal.hide();
    },
    clearQty() {
      this.qty = 1;
    },
  },
  watch: {
    product() {
      this.qty = 1;
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: "static",
    });
  },
};
