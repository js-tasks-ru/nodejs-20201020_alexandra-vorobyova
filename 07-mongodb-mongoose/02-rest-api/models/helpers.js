const transformResponce = (item, ret) => {
    ret.id = item._id;
    ret.title = item.title;
    delete ret._id;
    delete ret.__v;
}

module.exports = transformResponce;