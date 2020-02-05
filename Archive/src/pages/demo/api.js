export default {
    async fetchProfile() {
        const res = await app.$axios.get('https://my-json-server.typicode.com/menogo/jsonapi/profile');
        return res;
    },

    async updateProfile() {
        const res = await app.$axios({
            url: 'https://my-json-server.typicode.com/menogo/jsonapi/profile',
            method: 'POST',
            data: {
                name: 'john',
                age: 27
            }
        });

        return res;
    },

    async updateProfile2() {
        const res = await app.$axios.post(
            'https://my-json-server.typicode.com/menogo/jsonapi/profile',
            {
                name: 'john',
                age: 27
            },
            { loading: false }
        );

        return res;
    },

    async fetMenuList() {
        const res = await app.$axios.get('http://testabt.oa.com/getMenuList');
        return res;
    }
};
