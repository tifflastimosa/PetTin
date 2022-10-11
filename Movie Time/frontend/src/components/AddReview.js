import React, { useState } from 'react';
import MovieDataService from "../services/movies"
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const AddReview = ({ user }) => {

   const navigate = useNavigate()
   let params = useParams();
   let editing = false;
   let initialReviewState = "";
   // the Location of the review - data revealed:

   let location = useLocation();
   console.log("Location: ", location);
   console.log("Params: ", params);



   if (location.state === null) {
    editing = false;
   } else {
    editing = true;
    console.log(location.state.currentReview._id);
   }

   // initialReviewState will have a different value if we're editing an existing review
   const [review, setReview] = useState(initialReviewState);

   const onChangeReview = e => {
    const review = e.target.value;
    setReview(review);
   }

   // puts together the data object and send it to the movies service method to be
   // submitted via API call

   const saveReview = () => {
    var data = {
        review: review, 
        name: user.name,
        user_id: user.googleId,
        movie_id: params.id
    }

    if (editing) {
        // TODO: Handle case where an existing review is being updated
        MovieDataService.updateReview(data,location.state.currentReview._id)
            .then(response => {
                navigate("/movies/" + params.id);
            })
            .catch(e => {
                console.log(e);
            })
    } else {
        MovieDataService.createReview(data)
        .then(response => {
            navigate("/movies/" + params.id);
        })
        .catch(e => {
            console.log(e);
        });
    }
   }

    return (
        <Container className="main-container">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>
                        { editing ? "Edit" : "Create" } Review
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        required
                        review={ review }
                        onChange={ onChangeReview }
                        defaultValue={ editing ? location.state.currentReview.review : ""}
                    />
                </Form.Group>
                <Button variant="primary" onClick={ saveReview }>
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default AddReview;