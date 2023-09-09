module.exports = ({ router, models }) => {
    const { ExpenseType } = models;

    router.post("/expenseType/create", async (ctx) => {
        const { fid, type } = ctx.request.body;
        await ExpenseType.create({
            fid,
            type,
        });

        ctx.body = {
            message: "ok",
            success: true,
        };
    });

    router.get("/expenseType/list", async (ctx) => {
        const list = await ExpenseType.findAll();

        const map = new Map()

        list.forEach(item => {
            if (item.fid) {
                const valueByFid = map.get(item.fid) || { children: [] }
                map.set(item.fid, {
                    label: valueByFid.label,
                    value: valueByFid.value,
                    children: [...valueByFid.children, { label: item.type, value: item.id }]
                })
            } else {
                const valueByFid = map.get(item.id) || { children: [] }
                map.set(item.id, {
                    label: item.type,
                    value: item.id,
                    children: [...valueByFid.children]
                })
            }
        })

        ctx.body = {
            message: "ok",
            success: true,
            body: Array.from(map.values()) || [],
        };
    });

};
