import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

// Define categories as a constant array (renamed to plural for clarity)
const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "AI Developer",
    "FullStack Developer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="w-full">
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {categories.map((cat, index) => (
                        <CarouselItem 
                            key={cat} // Using category name as key since they're unique
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Button 
                                onClick={() => searchJobHandler(cat)}
                                variant="outline" 
                                className="rounded-full w-full"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;