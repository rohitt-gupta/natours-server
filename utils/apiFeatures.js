/**
 * queryString is somthing which comes from the express,from the API.
 * query is
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const { ...queryObj } = this.queryString;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // if no sort functionality is povided it will give with the order of date created latest first.
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const pages = this.queryString.page * 1 || 1;
    const limits = this.queryString.limit * 1 || 100;
    const skip = (pages - 1) * limits;

    this.query = this.query.skip(skip).limit(limits);

    return this;
  }
}
module.exports = APIFeatures;
