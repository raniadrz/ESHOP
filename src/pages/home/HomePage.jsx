import Category from "../../components/category/Category";
import HeroSection from "../../components/heroSection/HeroSection";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import SearchByTitle from "../../components/searchBar/SearchBar";
import Testimonial from "../../components/testimonial/Testimonial";

const HomePage = () => {
    return (
        <Layout>
            <HeroSection/>
            <Category/>
            <SearchByTitle/>
            <HomePageProductCard/>
            <Testimonial/>
        </Layout>
    );
}

export default HomePage;
