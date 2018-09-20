const hasAnyResources = {
    bind: function (el, binding, vnode) {

        let resources = JSON.parse(localStorage.getItem('resources'));
        let flag = resources.some(resources => {
            let value = binding.value;
            return value.some(v => {
                return v === resources.authority;
            });
        });

        if (flag) {
            el.style.display = "";
        } else {
            el.style.display = "none";
        }
    }
};

export default hasAnyResources
