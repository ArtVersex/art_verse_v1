"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Loader2
} from "lucide-react";

export default function CommissionForm({ artist }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Commission Request",
    budget: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Add safety check
  if (!artist) {
    return null;
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/commission-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artistName: artist.name,
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Your commission request has been sent successfully! We'll get back to you within 48 hours."
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "Commission Request",
          budget: "",
          message: ""
        });
      } else {
        throw new Error(data.error || "Failed to send request");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to send request. Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = artist.phone?.replace(/\D/g, "") || "";
    const message = encodeURIComponent(
      `Hi ${artist.name}, I'm interested in commissioning an artwork. I'd love to discuss my vision with you.`
    );
    
    // WhatsApp URL - make sure phone number includes country code
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="mb-16 relative z-10">
      <div className="flex items-center mb-8">
        <div className="h-px flex-1 bg-stone-200"></div>
        <h2 className="text-2xl font-bold text-stone-800 px-4">Commission the Artist</h2>
        <div className="h-px flex-1 bg-stone-200"></div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-stone-800 mb-4">Get in Touch</h3>
            <p className="text-stone-600 mb-6">
              Interested in commissioning {artist.name} for a custom artwork? Fill out the form to start a conversation about your vision.
            </p>
            
            <div className="space-y-4">
              {artist.email && (
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700 mr-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-stone-500">Email</h4>
                    <a 
                      href={`mailto:${artist.email}`} 
                      className="text-amber-700 hover:text-amber-800 transition-colors text-sm"
                    >
                      {artist.email}
                    </a>
                  </div>
                </div>
              )}
              
              {artist.phone && (
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700 mr-3">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-stone-500 mb-1">Phone</h4>
                    <a 
                      href={`tel:${artist.phone}`} 
                      className="text-amber-700 hover:text-amber-800 transition-colors text-sm block mb-2"
                    >
                      {artist.phone}
                    </a>
                    <button
                      onClick={handleWhatsAppClick}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </button>
                  </div>
                </div>
              )}
              
              {artist.location && (
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700 mr-3">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-stone-500">Location</h4>
                    <p className="text-stone-600 text-sm">{artist.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium text-stone-800 mb-3">Commission Process</h4>
              <ol className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">1</div>
                  <span className="text-stone-600 text-sm">Initial consultation to discuss your vision</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">2</div>
                  <span className="text-stone-600 text-sm">Concept sketches and approval</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">3</div>
                  <span className="text-stone-600 text-sm">Creation of the artwork with progress updates</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">4</div>
                  <span className="text-stone-600 text-sm">Final review, delivery and installation</span>
                </li>
              </ol>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-stone-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-stone-800 mb-5">Commission Request</h3>
            
            {submitStatus && (
              <div 
                className={`mb-4 p-3 rounded-lg text-sm ${
                  submitStatus.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-600 mb-1">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                    placeholder="Saraswati Rao"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                    placeholder="saras@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-stone-600 mb-1">
                  Subject
                </label>
                <input 
                  type="text" 
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                  placeholder="Commission Request"
                />
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-stone-600 mb-1">
                  Budget Range (USD)
                </label>
                <select 
                  id="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all text-sm bg-white"
                >
                  <option value="">Select a budget range</option>
                  <option value="<500">Less than $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value=">5000">$5,000+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-600 mb-1">
                  Your Vision *
                </label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4" 
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                  placeholder="Describe what you're looking for..."
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </button>
                <p className="text-xs text-stone-500 mt-2 text-center">
                  You'll receive a response within 48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}