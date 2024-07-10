/* eslint-disable react/no-unescaped-entities */

const Testimonial = () => {
    return (
        <div>
            <section className="text-gray-600 body-font mb-10">
                {/* main  */}
                <div className="container px-5 py-10 mx-auto">
                    {/* Heading  */}
                    <h1 className=' text-center text-3xl font-bold text-black' >Testimonial</h1>
                    {/* para  */}
                    <h2 className=' text-center text-2xl font-semibold mb-10' >What our <span className=' text-blue-500'>customers</span> are saying</h2>

                    <div className="flex flex-wrap -m-4">
                        {/* Testimonial 1 */}
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_640.jpg" />
                                <p className="leading-relaxed">I've been a regular customer at Chic Tails Boutique Pet Shop for over a year now, and I couldn't be happier with their service.
                                The staff is incredibly knowledgeable and always goes above and beyond to help me find the best products for my pets.
                                My dog, Max, loves their selection of toys and treats, and I appreciate the high-quality food options they carry.
                                It's clear that they genuinely care about the well-being of the animals and their customers. Highly recommend!</p>
                                <span className="inline-block h-1 w-10 rounded bg-blue-500 mt-6 mb-4" />
                                <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Anna P.</h2>
                                <p className="text-gray-500">Customer</p>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://www.devknus.com/img/gawri.png" />
                                <p className="leading-relaxed">The Pet Shop has been a lifesaver for me and my two cats.
                                    Whenever I have questions about their diet or health, the friendly team is always ready to provide expert advice.
                                    The store is clean, well-organized, and stocked with everything I need, from grooming supplies to specialty cat food.
                                    I especially love their rewards program, which helps me save money while keeping my furry friends happy and healthy.
                                    Five stars all the way!</p>
                                <span className="inline-block h-1 w-10 rounded bg-blue-500 mt-6 mb-4" />
                                <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Kostantina S.</h2>
                                <p className="text-gray-500">Customer</p>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="lg:w-1/3 lg:mb-0 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://t4.ftcdn.net/jpg/01/99/00/79/360_F_199007925_NolyRdRrdYqUAGdVZV38P4WX8pYfBaRP.jpg?alt=media&token=324ddd80-2b40-422c-9f1c-1c1fa34943fa" />
                                <p className="leading-relaxed">As a first-time pet owner, I was overwhelmed with all the choices out there, but Pet Paradise made everything so much easier.
                                    The staff took the time to explain the different types of food, toys, and accessories that would be best for my new puppy.
                                    They even helped me set up a comfortable and safe space for him at home.
                                    I appreciate their dedication to customer service and the well-being of pets.
                                    It's the only pet shop I trust for all my pet's needs.</p>
                                <span className="inline-block h-1 w-10 rounded bg-blue-500 mt-6 mb-4" />
                                <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Alex N.</h2>
                                <p className="text-gray-500">Student</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonial