class APIFeatures {
  constructor(query, queryReqObj) {
    this.query = query;
    this.queryReqObj = queryReqObj;
  }

  filter() {
    const newQueryObj = { ...this.queryReqObj };

    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((el) => delete newQueryObj[el]);

    // convert condition $or. Ex: name=3,5 -> {'$or': [{name: 3}, {name: 5}]}
    for (const key in newQueryObj) {
      // check value of query has ','
      if (newQueryObj[key].includes(',')) {
        let valueArr = newQueryObj[key].split(',');
        newQueryObj[key] = { $in: valueArr };
      }
    }

    // convert to operator in mongoose
    // for use in find text index
    // now, delete it. Name is undefined in newQueryObj
    // so, when use find() -> it can return all name in database
    // after, we use find(index) to find name (saved)
    // Dùng find index để tìm 1 chuỗi mà 1 phần chuỗi đó khớp với keyword
    // ta cung cấp
    const nameTemp = newQueryObj.name;
    newQueryObj.name = undefined;

    let queryStr = JSON.stringify(newQueryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    if (nameTemp) {
      this.query.find({ $text: { $search: nameTemp } });
    }

    return this;
  }

  limit() {
    if (this.queryReqObj.limit > 0) {
      this.query = this.query.limit(parseInt(this.queryReqObj.limit));
    }

    return this;
  }

  sort() {
    if (this.queryReqObj.sort) {
      const sortBy = this.queryReqObj.sort.split(',').join('');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdDate');
    }

    return this;
  }
}

module.exports = APIFeatures;
