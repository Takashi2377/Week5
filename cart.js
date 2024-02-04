Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

import userProductModal from "./userProductModal.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yuetin-hexschool";

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      status: {
        addCartLoading: "",
        openModalLoading: "",
        modalAddCartLoading: "",
        cartQtyLoading: "",
      },
      carts: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(product) {
      this.status.openModalLoading = product.id;
      this.tempProduct = product;
      this.$refs.userProductModal.openModal();
      setTimeout(() => {
        this.status.openModalLoading = "";
      }, 1000);
    },
    addToCart(product_id, qty = 1, positon) {
      const order = {
        product_id,
        qty,
      };
      if (positon === "list") {
        this.status.addCartLoading = product_id;
        axios
          .post(`${apiUrl}/api/${apiPath}/cart`, {
            data: order,
          })
          .then((res) => {
            this.getCarts();
            this.status.addCartLoading = "";
          });
      } else {
        this.status.modalAddCartLoading = product_id;
        axios
          .post(`${apiUrl}/api/${apiPath}/cart`, {
            data: order,
          })
          .then((res) => {
            this.getCarts();
            this.status.modalAddCartLoading = "";
            this.$refs.userProductModal.closeModal();
          });
      }
    },
    getCarts() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        this.carts = res.data.data;
      });
    },
    changeCartQty(item, qty = 1) {
      const order = {
        product_id: item.product_id,
        qty,
      };
      this.status.cartQtyLoading = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {
          data: order,
        })
        .then((res) => {
          this.getCarts();
          this.status.cartQtyLoading = "";
        });
    },
    removeCartItem(id) {
      this.status.cartQtyLoading = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res) => {
        this.getCarts();
        this.status.cartQtyLoading = "";
      });
    },
    removeAllCarts() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res) => {
        this.getCarts();
      });
    },
    createOrder() {
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, {
          data: this.form,
        })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    const loader = this.$loading.show();
    this.getProducts();
    this.getCarts();
    setTimeout(() => {
      loader.hide();
    }, 1000);
  },
});

app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.component("userProductModal", userProductModal);
app.use(VueLoading.LoadingPlugin);

app.mount("#app");
