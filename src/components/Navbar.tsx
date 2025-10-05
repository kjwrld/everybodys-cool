"use client"
import * as React from "react"
import { Heart, Globe, GraduationCap, Users, HandHeart, Menu, X } from "lucide-react"
import Vector from "../imports/Vector"
const missionPhoto = '/images/a1aae565ef0eb6aa9c217f36688f4ea12a770a91.png'
const founderPhoto = '/images/8ff1d78a4303655cb096c3579909d018422a45fb.png'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import { Button } from "./ui/button"

const missionPrograms = [
  {
    title: "Transforming School Environments",
    href: "#programs",
    description: "Ending bullying and creating safe learning spaces where students thrive and develop confidence.",
    icon: <GraduationCap className="w-4 h-4" />
  },
  {
    title: "Building Tomorrow's Leaders",
    href: "#principles", 
    description: "Empowering students with moral courage through our proven 5 COOL Principles methodology.",
    icon: <Users className="w-4 h-4" />
  },
  {
    title: "Creating Lasting Change",
    href: "#speaking",
    description: "From individual transformation to community impact—students become catalysts for world peace.",
    icon: <Heart className="w-4 h-4" />
  },
  {
    title: "50,000+ Students Impacted",
    href: "#peace",
    description: "Proven results across Oakland and beyond—breaking cycles of violence and building peaceful futures.",
    icon: <Globe className="w-4 h-4" />
  }
]

const aboutItems = [
  {
    title: "Our Journey",
    href: "#story",
    description: "We started humbly in 2016 running pop-ups across the Bay promoting peace and motivation. Through partnerships with OUSD and Oakland Parks & Rec, we've helped over 50,000 students in 10 years under the Everybody's Cool banner."
  }
]

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { 
  href: string
  icon?: React.ReactNode
}) {
  return (
    <li {...props}>
      <div className="block select-none space-y-2 p-4 leading-none rounded-lg cursor-default">
        <div className="flex items-center gap-3">
          {icon && <span className="text-[#185CFC]">{icon}</span>}
          <div className="text-sm font-semibold leading-none text-gray-900">{title}</div>
        </div>
        <p className="text-sm leading-relaxed text-gray-600 pl-8">
          {children}
        </p>
      </div>
    </li>
  )
}

export function Navbar({ onOpenSchoolBooking }: { onOpenSchoolBooking?: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Floating Modern Navbar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-6xl mx-auto px-4">
        {/* Navigation Menu Container - overflow visible for dropdowns */}
        <div className="relative">
          {/* Visual navbar background - overflow hidden for grain clipping */}
          <div className="bg-[#185CFC] backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 relative overflow-hidden">
            {/* Grain texture overlay with proper border radius */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl" style={{ filter: 'contrast(170%) brightness(100%)' }}>
              <defs>
                <filter id="navbarGrainFilter">
                  <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.9" 
                    numOctaves="4" 
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0"/>
                </filter>
              </defs>
              <rect 
                width="100%" 
                height="100%" 
                filter="url(#navbarGrainFilter)" 
                opacity="0.4"
                style={{ mixBlendMode: 'multiply' }}
                rx="1rem"
                ry="1rem"
              />
            </svg>
            <div className="flex h-16 items-center justify-between px-6 relative z-10">
              {/* Logo */}
              <div className="flex items-center">
                <div className="max-w-5 max-h-5 text-white hover:text-white/80 transition-colors cursor-pointer">
                  <Vector />
                </div>
              </div>

              {/* Desktop Navigation Spacer - invisible but maintains layout */}
              <div className="hidden lg:flex items-center">

              </div>

              {/* Desktop Donate Button */}
              <div className="hidden lg:block">
                <button 
                  onClick={onOpenSchoolBooking}
                  className="group flex items-center gap-2 px-4 py-2 text-white hover:text-white focus:text-white active:text-white transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] focus:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] font-medium text-sm rounded-xl">
                  <span>Transform Your School</span>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white rounded-xl"
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* ACTUAL Navigation Menu - Positioned Absolutely Outside Visual Container */}
          <div className="absolute top-0 left-0 w-full h-16 flex items-center justify-center pointer-events-none">
            <div className="hidden lg:flex items-center pointer-events-auto">
              <NavigationMenu>
                <NavigationMenuList className="gap-2" >
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-white hover:text-white focus:text-white active:text-white data-[state=open]:text-white data-[state=closed]:text-white transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] focus:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] px-4 py-2 font-medium !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent data-[state=open]:!bg-transparent data-[state=closed]:!bg-transparent focus-visible:!bg-transparent !border-0 !shadow-none !outline-none">
                      Our Mission
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[100] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden relative">
                      {/* White grain texture background for dropdown */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-xl" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                        <defs>
                          <filter id="dropdownWhiteGrainFilter">
                            <feTurbulence 
                              type="fractalNoise" 
                              baseFrequency="0.9" 
                              numOctaves="4" 
                              stitchTiles="stitch"
                            />
                            <feColorMatrix type="saturate" values="0"/>
                          </filter>
                        </defs>
                        <rect 
                          width="100%" 
                          height="100%" 
                          filter="url(#dropdownWhiteGrainFilter)" 
                          opacity="0.15"
                          style={{ mixBlendMode: 'multiply' }}
                          rx="0.75rem"
                          ry="0.75rem"
                        />
                      </svg>
                      <div className="p-6 relative z-10">
                        <ul className="grid gap-4 w-[520px] lg:w-[640px] lg:grid-cols-2">
                          <li className="row-span-4">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end p-8 no-underline outline-none transition-all duration-300 rounded-lg relative overflow-hidden group"
                                href="#mission"
                              >
                                {/* Background image with zoom effect */}
                                <div 
                                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
                                  style={{
                                    backgroundImage: `url('${missionPhoto}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                  }}
                                />                    
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {missionPrograms.map((program) => (
                            <ListItem
                              key={program.title}
                              href={program.href}
                              title={program.title}
                              icon={program.icon}
                            >
                              {program.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="!bg-transparent">
                    <NavigationMenuTrigger className="text-white hover:text-white focus:text-white active:text-white data-[state=open]:text-white data-[state=closed]:text-white transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] focus:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] px-4 py-2 font-medium !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent data-[state=open]:!bg-transparent data-[state=closed]:!bg-transparent focus-visible:!bg-transparent !border-0 !shadow-none !outline-none">
                      About
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[100] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden relative">
                      {/* White grain texture background for dropdown */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-xl" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                        <defs>
                          <filter id="dropdownWhiteGrainFilter2">
                            <feTurbulence 
                              type="fractalNoise" 
                              baseFrequency="0.9" 
                              numOctaves="4" 
                              stitchTiles="stitch"
                            />
                            <feColorMatrix type="saturate" values="0"/>
                          </filter>
                        </defs>
                        <rect 
                          width="100%" 
                          height="100%" 
                          filter="url(#dropdownWhiteGrainFilter2)" 
                          opacity="0.15"
                          style={{ mixBlendMode: 'multiply' }}
                          rx="0.75rem"
                          ry="0.75rem"
                        />
                      </svg>
                      <div className="p-6 relative z-10">
                        <ul className="grid gap-4 w-[520px] lg:w-[640px] lg:grid-cols-2">
                          <li className="row-span-4">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end p-8 no-underline outline-none transition-all duration-300 rounded-lg relative overflow-hidden group"
                                href="#founder"
                              >
                                {/* Founder image with zoom effect */}
                                <div 
                                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
                                  style={{
                                    backgroundImage: `url('${founderPhoto}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                  }}
                                />
                                {/* Gradient overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                {/* Photo caption text */}
                                <div className="relative z-10 text-white">
                                  
                                  <p className="text-sm text-white/90 leading-relaxed">
                                    Our Founder, Kymm, with his two children at an Everybody's Cool pop up event (2020)
                                  </p>
                                </div>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {aboutItems.map((item) => (
                            <ListItem
                              key={item.title}
                              title={item.title}
                              href={item.href}
                            >
                              {item.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="!bg-transparent">
                    <NavigationMenuTrigger className="text-white hover:text-white focus:text-white active:text-white data-[state=open]:text-white data-[state=closed]:text-white transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] focus:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] px-4 py-2 font-medium !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent data-[state=open]:!bg-transparent data-[state=closed]:!bg-transparent focus-visible:!bg-transparent !border-0 !shadow-none !outline-none">
                      Shop
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[100] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden relative">
                      {/* White grain texture background for dropdown */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-xl" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                        <defs>
                          <filter id="dropdownWhiteGrainFilter4">
                            <feTurbulence 
                              type="fractalNoise" 
                              baseFrequency="0.9" 
                              numOctaves="4" 
                              stitchTiles="stitch"
                            />
                            <feColorMatrix type="saturate" values="0"/>
                          </filter>
                        </defs>
                        <rect 
                          width="100%" 
                          height="100%" 
                          filter="url(#dropdownWhiteGrainFilter4)" 
                          opacity="0.15"
                          style={{ mixBlendMode: 'multiply' }}
                          rx="0.75rem"
                          ry="0.75rem"
                        />
                      </svg>
                      <div className="p-6 relative z-10">
                        <div className="grid gap-4 w-[400px]">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 text-lg">Join the Movement!</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <a 
                                href="#shop-apparel" 
                                className="p-4 rounded-lg border border-gray-200 hover:border-[#185CFC] transition-colors group"
                              >
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-[#185CFC] transition-colors">Apparel</h4>
                                  <p className="text-xs text-gray-600">
                                    Hoodies, t-shirts, and caps with our inspiring messaging
                                  </p>
                                </div>
                              </a>
                              
                              <a 
                                href="#shop-accessories" 
                                className="p-4 rounded-lg border border-gray-200 hover:border-[#185CFC] transition-colors group"
                              >
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-[#185CFC] transition-colors">Accessories</h4>
                                  <p className="text-xs text-gray-600">
                                    Water bottles, stickers, and branded school supplies
                                  </p>
                                </div>
                              </a>
                              
                              <a 
                                href="#shop-books" 
                                className="p-4 rounded-lg border border-gray-200 hover:border-[#185CFC] transition-colors group"
                              >
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-[#185CFC] transition-colors">Books & Resources</h4>
                                  <p className="text-xs text-gray-600">
                                    Educational materials and inspiring literature
                                  </p>
                                </div>
                              </a>
                              
                              <a 
                                href="#shop-bundles" 
                                className="p-4 rounded-lg border border-gray-200 hover:border-[#185CFC] transition-colors group"
                              >
                                <div className="space-y-2">
                                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-[#185CFC] transition-colors">Gift Bundles</h4>
                                  <p className="text-xs text-gray-600">
                                    Curated packages perfect for students and educators
                                  </p>
                                </div>
                              </a>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-600 text-center">
                                All proceeds support our mission to reach 1,000,000 students
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem className="!bg-transparent">
                    <NavigationMenuTrigger className="text-white hover:text-white focus:text-white active:text-white data-[state=open]:text-white data-[state=closed]:text-white transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] focus:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] px-4 py-2 font-medium !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent data-[state=open]:!bg-transparent data-[state=closed]:!bg-transparent focus-visible:!bg-transparent !border-0 !shadow-none !outline-none">
                      Contact Us
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[100] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden relative">
                      {/* White grain texture background for dropdown */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-xl" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                        <defs>
                          <filter id="dropdownWhiteGrainFilter3">
                            <feTurbulence 
                              type="fractalNoise" 
                              baseFrequency="0.9" 
                              numOctaves="4" 
                              stitchTiles="stitch"
                            />
                            <feColorMatrix type="saturate" values="0"/>
                          </filter>
                        </defs>
                        <rect 
                          width="100%" 
                          height="100%" 
                          filter="url(#dropdownWhiteGrainFilter3)" 
                          opacity="0.15"
                          style={{ mixBlendMode: 'multiply' }}
                          rx="0.75rem"
                          ry="0.75rem"
                        />
                      </svg>
                      <div className="p-6 relative z-10">
                        <div className="grid gap-4 w-[400px]">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 text-lg">Get in Touch</h3>
                            
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 text-sm">General Inquiries</h4>
                                <a 
                                  href="mailto:info@everybodyscool.com" 
                                  className="text-[#185CFC] hover:text-[#457CFD] transition-colors text-sm block"
                                >
                                  info@everybodyscool.com
                                </a>
                                <p className="text-xs text-gray-600">
                                  Reach our team for program information, school partnerships, and speaking engagements.
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 text-sm">Donations & Tax Information</h4>
                                <a 
                                  href="mailto:sbennett@everybodyscool.org" 
                                  className="text-[#185CFC] hover:text-[#457CFD] transition-colors text-sm block"
                                >
                                  Sakara Sampson - sbennett@everybodyscool.org
                                </a>
                                <p className="text-xs text-gray-600">
                                  For donation receipts, tax-deductible contribution documentation, and 501(c)(3) nonprofit verification.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Reduced opacity */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel - Blue Background with Grain */}
      <div className={`fixed top-0 right-0 h-full w-full bg-[#185CFC] backdrop-blur-xl shadow-2xl z-[80] lg:hidden ${
        isOpen ? 'block' : 'hidden'
      }`}>
        {/* Grain texture overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
          <defs>
            <filter id="mobileMenuGrainFilter">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.9" 
                numOctaves="4" 
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0"/>
            </filter>
          </defs>
          <rect 
            width="100%" 
            height="100%" 
            filter="url(#mobileMenuGrainFilter)" 
            opacity="0.4"
            style={{ mixBlendMode: 'multiply' }}
          />
        </svg>
        <div className="flex flex-col h-full relative z-10">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center">
              <div className="max-w-5 max-h-5 text-white hover:text-white/80 transition-colors cursor-pointer">
                <Vector />
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Mission Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg px-2">Our Mission</h3>
              <div className="space-y-2">
                {missionPrograms.map((program) => (
                  <div
                    key={program.title}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:shadow-md group mx-2"
                  >
                    <span className="text-white p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                      {program.icon}
                    </span>
                    <div className="flex-1">
                      <span className="font-semibold text-white block leading-tight group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200">{program.title}</span>
                      <span className="text-sm text-white/80 leading-relaxed">{program.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg px-2">About</h3>
              <div className="space-y-2">
                {aboutItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="block p-4 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:shadow-md mx-2 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-semibold text-white block group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200">{item.title}</span>  
                    <span className="text-sm text-white/80 leading-relaxed">{item.description}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg px-2">Shop</h3>
              <div className="mx-2">
                <a
                  href="#shop"
                  className="block p-4 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:shadow-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-semibold text-white block group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200">Join the Movement!</span>  
                  <span className="text-sm text-white/80 leading-relaxed">Support our mission with branded apparel and accessories</span>
                </a>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg px-2">Contact Us</h3>
              <div className="space-y-2 mx-2">
                <a
                  href="mailto:info@everybodyscool.com"
                  className="block p-4 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:shadow-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="font-semibold text-white block group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200">
                    General Inquiries
                  </div>
                  <div className="text-sm text-white/80 mt-1">
                    info@everybodyscool.com
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    Program info • School partnerships • Speaking engagements
                  </div>
                </a>
                <a
                  href="mailto:sbennett@everybodyscool.org"
                  className="block p-4 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:shadow-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="font-semibold text-white block group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200">
                    Donations & Tax Information
                  </div>
                  <div className="text-sm text-white/80 mt-1">
                    Sakara Sampson - sbennett@everybodyscool.org
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    Tax-deductible receipts • 501(c)(3) verification
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="p-6 border-t border-white/20">
            <button 
              className="relative group w-full bg-gradient-to-r from-[#d1d5db] via-[#f9fafb] to-[#d1d5db] hover:from-[#e5e7eb] hover:via-[#ffffff] hover:to-[#e5e7eb] transition-all duration-300 h-[56px] rounded-[16px] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 px-8 overflow-hidden"
              onClick={() => setIsOpen(false)}
            >
              {/* Grain texture overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                <defs>
                  <filter id="mobileButtonGrainFilter">
                    <feTurbulence 
                      type="fractalNoise" 
                      baseFrequency="0.9" 
                      numOctaves="4" 
                      stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0"/>
                  </filter>
                </defs>
                <rect 
                  width="100%" 
                  height="100%" 
                  filter="url(#mobileButtonGrainFilter)" 
                  opacity="0.2"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </svg>
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 font-medium text-[#4A5565] text-[16px]">
                Donate Now
              </span>
              <div className="relative z-10 w-5 h-5 text-[#4A5565] group-hover:translate-x-1 transition-transform duration-200 flex items-center justify-center">
                →
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}