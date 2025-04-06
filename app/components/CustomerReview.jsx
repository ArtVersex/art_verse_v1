export default function CustomerReview() {
    const reviews = [
      {
        id: 1,
        name: "Sarah Johnson",
        message: "The artwork I purchased exceeded my expectations. The colors are even more vibrant in person than they appeared online. It's now the centerpiece of my living room.",
        rating: 5,
        date: "March 15, 2025",
        image: "/api/placeholder/60/60"
      },
      {
        id: 2,
        name: "Michael Chen",
        message: "I've been following this artist for years and finally purchased my first piece. The attention to detail is remarkable and the shipping was fast and secure.",
        rating: 5,
        date: "March 10, 2025",
        image: "/api/placeholder/60/60"
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        message: "Beautiful work that captures emotion perfectly. The artist was also very responsive to my questions before purchase.",
        rating: 4,
        date: "February 28, 2025",
        image: "/api/placeholder/60/60"
      },
      {
        id: 4,
        name: "David Wilson",
        message: "Unique style that stands out from other artists. The piece arrived slightly later than expected, but was well packaged and in perfect condition.",
        rating: 4,
        date: "February 20, 2025",
        image: "/api/placeholder/60/60"
      }
    ];
  
    // Function to render hearts based on rating (changed from stars)
    const renderHearts = (rating) => {
      const hearts = [];
      for (let i = 0; i < 5; i++) {
        hearts.push(
          <span key={i} className={`text-xl ${i < rating ? "text-red-500" : "text-gray-300"}`}>
            ❤
          </span>
        );
      }
      return hearts;
    };
  
    return (
        <div className="bg-[#f8f8f8]">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                {/* <img
                  src={review.image}
                  alt={`${review.name}'s profile`}
                  className="w-12 h-12 rounded-full mr-4"
                /> */}
                <div>
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <p className="text-gray-500 text-sm">{review.date}</p>
                </div>
              </div>
              
              <div className="mb-3">{renderHearts(review.rating)}</div>
              
              <p className="text-gray-700">{review.message}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-600 mb-4">Overall Customer Satisfaction</p>
          <div className="flex justify-center mb-2">
            {renderHearts(4.5)}
          </div>
          <p className="text-gray-500">Based on {reviews.length} reviews</p>
        </div>
      </div>
      </div>
    );
  }