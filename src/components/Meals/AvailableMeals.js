import { useEffect, useState } from 'react';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
    const { REACT_APP_API_ENDPOINT: getMealsURI } = process.env;

    const [meals, setMeals] = useState([]);
    useEffect(() => {
        const fetchMeals = async () => {
            console.log("URL--",getMealsURI)
            const response = await fetch(`${getMealsURI}`);
            const responseData = await response.json();
            console.log("Response Data--", responseData)
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
        };

        fetchMeals();
    }, [getMealsURI])

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