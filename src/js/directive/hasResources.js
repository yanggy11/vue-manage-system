const hasResources = {
    bind: function (el, binding, vnode) {

        let resources = JSON.parse(localStorage.getItem('resources'));
        let flag = resources.some(resource => {
            return resource.authority === binding.value;
        });

        if (flag) {
            el.style.display = "";
        } else {
            el.style.display = "none";
        }
    }
};

export default hasResources
