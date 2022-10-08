import { useEffect, useState } from 'react';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
    const { REACT_APP_API_ENDPOINT: getMealsURI } = process.env;

    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    /**
     * To check whether our error state is working or not, we misspelled the URL.
     * And In code I'm throwing an error .[throw new Error("Something went wrong.")]
     * 
     * The error is thrown inside fetchMeals(), which is a async function.
     * 
     * Async function always returns a promise, which we consume using await.
     * 
     * While calling fetchMeals, we need to use await as it will return promise. Using await directly inside callback passed to useEffect, will force us to make the callback an async function.
     * 
     * Rule says, we shouldn't use async function directly inside useEffect as there may be a need of returning a cleanup function from inside useEffect
     * 
     * Solution 1: As a turnaround, we could wrap another function to our try catch block and make that async and use await inside that function while calling fetchMeals() or
     * 
     * Solution 2: As fetchMeals will return an promise, a rejected promise, we can access that using catch block on that promise.
     * 
     * We followed 2nd Approach here.
     * 
     * But throwing an error will then Reject the promise. 
     */
    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch(`${getMealsURI}`);

            if (!response.ok) {
                throw new Error("Failed to fetch.")
            }

            const responseData = await response.json();

            const loadedMeals = [];

            for (const key in responseData) {
                loadedMeals.push({
                    id: key,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    price: responseData[key].price
                });
            }
            setMeals(loadedMeals);
            setIsLoading(false);
        };

        fetchMeals().catch(error => {
            setIsLoading(false);
            console.log("Error----", error.message)
            setHttpError(error.message);
        });

    }, [getMealsURI])

    if (isLoading) {
        return <section className={classes.MealsLoading}>
            <p>Loading...</p>
        </section>
    }

    if (httpError) {
        return <section className={classes.MealsError}>
            <p>{httpError}</p>
        </section>
    }

    const mealsList = meals.map(meal => (
        <MealItem
            id={meal.id}
            key={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />
    ));
    return <section className={classes.meals}>
        <Card>
            <ul>
                {mealsList}
            </ul>
        </Card>
    </section>
};

export default AvailableMeals;