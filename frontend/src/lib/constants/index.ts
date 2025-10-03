import type { FooterSectionI, WhyChooseUsI } from "$lib/interfaces";
import TrophyIcon from "$lib/assets/trophy.svg";
import ChairIcon from "$lib/assets/chair.svg";
import TruckIcon from "$lib/assets/truck.svg";
import MoneyBagIcon from "$lib/assets/money-bag.svg";

export const ROUTE_NAVS = [
	{
		label: "Home",
		route: "/"
	},
	{
		label: "Shop",
		route: "/shop"
	},
	{
		label: "About",
		route: "/about"
	},
	{
		label: "FAQs",
		route: "/faqs"
	},
	{
		label: "News",
		route: "/news"
	}
] as const;

export const whyChooseUs: {
	title: {
		label: string;
		description: string;
	};
	reasons: WhyChooseUsI[];
} = {
	title: {
		label: "why choose us",
		description:
			"We are committed to providing you with the best furniture shopping experience. Here’s why we stand out:"
	},
	reasons: [
		{
			icon: TrophyIcon,
			label: "premium quality & durability",
			description:
				"Our furniture is crafted from top-quality materials, ensuring long-lasting durability, comfort, and timeless style for your home or office."
		},
		{
			icon: ChairIcon,
			label: "wide selection for every space",
			description:
				"From modern to classic designs, we offer a diverse range of furniture to match your taste, whether you're furnishing your living room, bedroom, or workspace."
		},
		{
			icon: TruckIcon,
			label: "seamless shopping & reliable delivery",
			description:
				"We make furniture shopping effortless with an easy-to-use website, secure payment options, and fast, reliable delivery straight to your doorstep"
		},
		{
			icon: MoneyBagIcon,
			label: "affordable prices & exclusive discount",
			description:
				"Style shouldn't break the bank! Enjoy competitive pricing, seasonal promotions, and exclusive discounts to make your dream space a reality at the best value"
		}
	]
};

export const footerLinks: FooterSectionI[] = [
	{
		title: "quick links",
		links: [
			{
				label: "Home",
				link: "/"
			},
			{
				label: "Shop",
				link: "/"
			},
			{
				label: "Cart",
				link: "/"
			},
			{
				label: "FAQ",
				link: "/"
			},
			{
				label: "Offer & Details",
				link: "/"
			}
		]
	},
	{
		title: "company",
		links: [
			{
				label: "About Us",
				link: "/"
			},
			{
				label: "Careers",
				link: "/"
			},
			{
				label: "News",
				link: "/"
			}
		]
	},
	{
		title: "legal services",
		links: [
			{
				label: "Terms & Conditions",
				link: "/"
			},
			{
				label: "Privacy Policy",
				link: "/"
			},
			{
				label: "Cookie Policy",
				link: "/"
			}
		]
	},
	{
		title: "contact us",
		links: [
			{
				label: "+233206238380",
				link: "tel:+233206238380"
			},
			{
				label: "dwell-well@gmail.com",
				link: "mailto:dwell-well@gmail.com"
			}
		]
	}
];
