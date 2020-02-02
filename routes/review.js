var express = require('express');
var router = express.Router();
const Review = require('../database/schemas/review');

	/**
	 * @swagger
	 * paths: 
	 *  /review:
	 *    get:
	 *      tags:
	 *      - "review"
	 *      summary: "get review list"
	 *      description: "get review list"
	 *      produces:
	 *      - "apllication/json"
	 *      parameters:
	 *      - name: "reviewId"
	 *        in: "query"
	 *        description: "review id for detail"
	 *        type: "string"
	 *        required: false
	 *      - name: "placeId"
	 *        in: "query"
	 *        description: "place id for review list"
	 *        type: "string"
	 *        required: false 
	 *      - name: "memberId"
	 *        in: "query"
	 *        description: "place writer id"
	 *        type: "string"
	 *        required: false 
	 *      - name: "reviewerId"
	 *        in: "query"
	 *        description: "review writer id"
	 *        type: "string"
	 *        required: false 
	 *      - name: "pageSize"
	 *        in: "query"
	 *        description: "page size"
	 *        type: "query"
	 *        format: "Number"
	 *      - name: "curPage"
	 *        in: "query"
	 *        description: "current page"
	 *        type: "query"
	 *        format: "Number"
	 *      responses:
	 *        200:
	 *          description: "get review list success."
	 *          schema:
	 *            $ref: "#/definitions/Review"
	 */


	router.get('/review', async function(req, res) {
		let searchCondition = req.query
		let pageSize = 10;
		let curPage = 1;
		let resultObj = {};

		if (searchCondition.pageSize !== undefined) {
			pageSize = searchCondition.pageSize;
			searchCondition.pageSize = undefined;
		}
		if (searchCondition.curPage !== undefined) {
			curPage = searchCondition.curPage;
			searchCondition.curPage = undefined;
		}

		Review.find(
			searchCondition
		)
		.sort({'regDate': -1})
		.skip( (curPage-1) * pageSize)
		.limit(pageSize)
		.exec(function(err, reviewList) {
			if(err) {
				resultObj.resultCode = 500;
				resultObj.resultMsg = 'fail';
				resultObj.result = err;
				res.status(500).send(resultObj);
			}
			resultObj.resultCode = 200;
			resultObj.resultMsg = 'success';
			resultObj.result = reviewList;
			res.status(200).send(resultObj);
		});

	});

	/**
	 * @swagger
	 * paths: 
	 *  /review:
	 *    post:
	 *      tags:
	 *      - "review"
	 *      summary: "create review file"
	 *      description: "create review file"
	 *      produces:
	 *      - "multipart/form-data"
	 *      parameters:
	 *      - name: "placeId"
	 *        in: "formData"
	 *        description: "placeId"
	 *        type: "string"
	 *        required: true 
	 *      - name: "memberId"
	 *        in: "formData"
	 *        description: "place write member Id"
	 *        type: "string"
	 *        required: true 
	 *      - name: "reviewerId"
	 *        in: "formData"
	 *        description: "reviewer Id"
	 *        type: "string"
	 *        required: true 
	 *      - name: "comment"
	 *        in: "formData"
	 *        description: "review comment"
	 *        type: "string"
	 *        required: true
	 *      responses:
	 *        200:
	 *          description: "post review success"
	 *          schema:
	 *            $ref: "#/definitions/Review"
	 */

	router.post('/review', async function(req, res) {
		//const moment = require('moment');
		//const uuid = require('uuid/v1');
		let review = req.body;
		let dateTime = new Date();
		let resultObj = {};

		//dateTime = moment(dateTime).format('YYYYMMDDHHmmss');

		//review.reviewId = review.memberId + '_' + dataTime;

		Review.createReview(review).then( function(data) {
			resultObj.resultCode = 200;
			resultObj.resultMsg = 'success';
			resultObj.reviewId = data.reviewId;
			res.status(200).send(resultObj);
		}).catch(function (err) {
			res.status(500).send(err);
		});	// catch
	});

	/**
	 * @swagger
	 * paths: 
	 *  /review:
	 *    put:
	 *      tags:
	 *      - "review"
	 *      summary: "update review"
	 *      description: "update review"
	 *      produces:
	 *      - "multipart/form-data"
	 *      parameters:
	 *      - name: "reviewId"
	 *        in: "formData"
	 *        description: "review id"
	 *        type: "string"
	 *        required: true 
	 *      - name: "placeId"
	 *        in: "formData"
	 *        description: "placeId"
	 *        type: "string"
	 *        required: false
	 *      - name: "comment"
	 *        in: "formData"
	 *        description: "review comment"
	 *        type: "string"
	 *        required: true
	 *      responses:
	 *        200:
	 *          description: "update review success."
	 *          schema:
	 *            $ref: "#/definitions/Review"
	 */

	router.put('/review', async function(req, res) {
		let resultObj = {};
		let review = {};

		review = req.body;

		Review.updateReview(review.reviewId, review)
			.then(function (review) {
				resultObj.resultCode = 200;
				resultObj.resultMsg = 'success';
				resultObj.result = review;
				res.status(resultObj.resultCode).send(resultObj);
			})
			.catch(function (err) {
				resultObj.resultCode = 500;
				resultObj.resultMsg = 'fail';
				resultObj.result = err;
				res.status(resultObj.resultCode).send(resultObj);
			});

	});	// app.put('/review')

	/**
	 * @swagger
	 * paths: 
	 *  /review:
	 *    delete:
	 *      tags:
	 *      - "review"
	 *      summary: "delete review"
	 *      description: "delete review"
	 *      produces:
	 *      - "application/json"
	 *      parameters:
	 *      - name: "reviewId"
	 *        in: "formData"
	 *        description: "review id"
	 *        type: "string"
	 *        required: true 
	 *      - name: "placeId"
	 *        in: "formData"
	 *        description: "placeId"
	 *        type: "string"
	 *        required: false
	 *      responses:
	 *        200:
	 *          description: "delete review success."
	 *          schema:
	 *            $ref: "#/definitions/Review"
	 */
	router.delete('/review', async function(req, res) {
		let params = {};
		let resultObj = {};

		params.Bucket = req.query.memberId;
		params.Prefix = 'reviewId/' + req.query.reviewId

		awsUtil.deleteFolder(params)
			.then(function (isDeleted) {
				if(isDeleted) {

					Review.deleteReview(req.query.reviewId)
						.then(review => {
							resultObj.resultCode = 200;
							resultObj.resultMsg = 'delete review success';
							res.status(resultObj.resultCode).send(resultObj);
						})
						.catch(err => {
							resultObj.resultCode = 500;
							resultObj.resultMsg = 'delete review fail';
							resultObj.result = err;
							res.status(resultObj.resultCode).send(resultObj);
						});

				} else {

				}

			});



		/*let pre;
		let params = {};
		
		params.Bucket = req.body.memberId;

		if(req.body.mediaArr !== undefined) {
			params.Delete = {};
			params.Delete.Objects = req.body.mediaArr
		} else if(req.body.reviewId !== undefined) {
			pre = req.body.reviewId + '/';
			params.Prefix = pre;
		} else if (req.body.placeId !== undefined) {
			pre = req.body.placeId + '/';
			params.Prefix = pre;
		} 

		if(pre !== undefined) {	// prefix exists... use awsUtil.deleteFolder
			awsUtil.deleteFolder(params)
				.then(function (isDeleted) {
					if(isDeleted) {
						res.status(200).send('awsUtil.deleteFolder success');
					} else {
						res.status(500).send('deleteFOlder error');
					}
				});
		} else {	// prefix is not exists... delete mediaArr
			S3.deleteObjects(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
					res.status(500).send('deleteObjects err : ' + err.stack);
				} else {
					res.status(200).send('delete media file success');
				}
			});
		}*/
		res.status(200).send('delete review success');
	});

module.exports = router;
