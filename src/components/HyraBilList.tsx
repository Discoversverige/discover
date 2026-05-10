"use client";

import { useMemo, useState, useEffect } from "react";

type Lang = "sv" | "en" | "de";
type Location = "all" | "airport" | "city";
type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

interface Car {
  id: string;
  name: string;
  category: string;
  image: string;
  supplier: string;
  supplierRating: number;
  ratingLabel: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  freeCancellation: boolean;
  mileage: string;
  isAirport: boolean;
  locationName: string;
  bookUrl: string;
}

const CARS: Car[] = [
  {
    id: "SM96",
    name: "Peugeot 2008",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8392/220.png",
    supplier: "Budget",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 885,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-SM96?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI0MGU0N2JkOWE2NGU2MzY4NDU0MGFhNWIxM2RkYzE1YiJ9",
  },
  {
    id: "U5SU",
    name: "Kia Stonic",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx105373519.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 913,
    seats: 5,
    transmission: "Manuell",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-U5SU?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1ZDY3OWExMjVhZjRiODk1MjNiYWUzYmIyM2Y2MjhhYiJ9",
  },
  {
    id: "GG6L",
    name: "Volkswagen Golf",
    category: "Compact",
    image: "https://fdsa.work/imagessx/sx8707.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 950,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-GG6L?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2ZGRiNTk0M2RiNGZkMWNlOWY3OWFmNTBhMjQ4MWEwMSJ9",
  },
  {
    id: "DHKE",
    name: "SEAT Arona",
    category: "Economy",
    image: "https://www.discovercars.com/images/car/7048/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 963,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-DHKE?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiYmRmNDVlZDViYTY4ODdmZTJlYTA3NDI3NDNiYjA0ZCJ9",
  },
  {
    id: "7LB3",
    name: "Peugeot 2008",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8695/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 974,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmo Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-7LB3?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiNmNiZjk4MDhmYjNlOGQ4ZTAwNjc2NDUwMmVjZjViZjcifQ%3D%3D",
  },
  {
    id: "DUDR",
    name: "Peugeot 2008",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8695/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 974,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-DUDR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2Y2JmOTgwOGZiM2U4ZDhlMDA2NzY0NTAyZWNmNWJmNyJ9",
  },
  {
    id: "S43L",
    name: "VW T-Roc",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx21269345.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 968,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-S43L?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJjNjExODJhMWE1YjYxY2U5YTdlOGEzNGVjNTRkNjY3NiJ9",
  },
  {
    id: "L6ST",
    name: "Lynk & Co 01",
    category: "Standard SUV",
    image: "https://fdsa.work/imagessx/sx47845528.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1251,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-L6ST?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3N2IyOTcxMDhmYjlkNGM1MzNmYWI4MmIyODgzNWNhOSJ9",
  },
  {
    id: "MBAX",
    name: "Volkswagen Tiguan",
    category: "Full-size SUV",
    image: "https://fdsa.work/imagessx/sx123254486.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1409,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-MBAX?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5MTBkYTJlYWRjN2I3N2EzZTRmM2U4N2ZlN2IxNDQyZCJ9",
  },
  {
    id: "KH8T",
    name: "Lexus NX",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx110441458.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1575,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-KH8T?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1YWYzYzA3MTUxOTY0MDlmMWI2ZTNjMjZlYWU1NjQ4OSJ9",
  },
  {
    id: "6XLL",
    name: "Skoda Scala",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8014/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1014,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-6XLL?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiOGQzMmJmZTllYjlmNTdkODliZWM1N2Y3NzdjZGM1MyJ9",
  },
  {
    id: "UJ3T",
    name: "Volvo XC60 4x4",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx8046890.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1733,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-UJ3T?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkhhc2giOiJhYjQzMzBjMzRlODE3NWFmOTczYWY1YjgzYzFmN2YwZiJ9",
  },
  {
    id: "S3Y3",
    name: "Audi A1",
    category: "Economy",
    image: "https://fdsa.work/imagessx/sx105373520.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1063,
    seats: 4,
    transmission: "Manuell",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-S3Y3?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIzMTg5YWQzMDgwNzlmYzViZDg1OTNjNjBkZmNiMzMwNiJ9",
  },
  {
    id: "DHBY",
    name: "Hyundai i10",
    category: "Mini",
    image: "https://www.discovercars.com/images/car/8224/220.png",
    supplier: "Europcar",
    supplierRating: 8.4,
    ratingLabel: "Very Good",
    pricePerDay: 1015,
    seats: 4,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/ca8ac3ef-8b72-4196-895e-36fd63451f29-DHBY?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTY1LCJEcm9wT2ZmTG9jYXRpb25JZCI6MzU2NSwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5OTBlOTE0NzM0ZmQxMDgwYzA5N2YwMmUzODUwMWMxNSJ9",
  },
  {
    id: "HNEV",
    name: "Renault Captur",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8089/220.png",
    supplier: "Hertz",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 1052,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmo Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-HNEV?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiYjZlZDhhYmI0ZWU4OTkzNWYzZjI1ODdhYmE5MTVkYTMifQ%3D%3D",
  },
  {
    id: "6H8T",
    name: "Audi Q2",
    category: "Compact SUV",
    image: "https://www.discovercars.com/images/car/7145/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1369,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-6H8T?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3YTQ2NjNlYTBkM2IxMzI0YjE4OTg5ZmVlNDc0MTcyOCJ9",
  },
  {
    id: "5D6C",
    name: "Hyundai i10",
    category: "Mini",
    image: "https://www.discovercars.com/images/car/8224/220.png",
    supplier: "Europcar",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1319,
    seats: 4,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-5D6C?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI5OTBlOTE0NzM0ZmQxMDgwYzA5N2YwMmUzODUwMWMxNSJ9",
  },
  {
    id: "AWAS",
    name: "Peugeot 5008 5+2",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8826/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1689,
    seats: 7,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmo Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-AWAS?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiYjY2NjNmOTZlZDY3NWQyNjI0MTJiNThlNzk1MzE3N2EifQ%3D%3D",
  },
  {
    id: "NR88",
    name: "Kia Sportage",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8229/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1689,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmo Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-NR88?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiZGZkOTBkMzE4OTdlNjgxMjEwMjY0OTM2ZDE0MDMwYWEifQ%3D%3D",
  },
  {
    id: "FW2Q",
    name: "Volkswagen Golf",
    category: "Compact",
    image: "https://fdsa.work/imagessx/sx8707.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1179,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-FW2Q?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3MGRhZjI5MjBhZWRjNDJkMmE0OTEwMzlmOWM4ZTQ4ZCJ9",
  },
  {
    id: "6R6F",
    name: "Volvo EX30",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx110441454.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1123,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-6R6F?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkOTNkODYwODZiMTY3MmY4NDBkMjM2MjczZTFiMmY2ZCJ9",
  },
  {
    id: "7DBP",
    name: "Tesla Model Y",
    category: "Premium SUV",
    image: "https://fdsa.work/imagessx/sx40794831.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1485,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-7DBP?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI4ZmIxYWIwNTdiNjcyYTk5YmY0NDc5NzZkNTQ2NmRhNCJ9",
  },
  {
    id: "YY5E",
    name: "Volvo XC40",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/7151/220.png",
    supplier: "Hertz",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1628,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-YY5E?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI3NjZmZjcwMDNiYjU3Y2VkYzJiNWM2ZTNmYTk2ZjNmNyJ9",
  },
  {
    id: "CFYF",
    name: "Peugeot 5008 5+2",
    category: "Standard SUV",
    image: "https://www.discovercars.com/images/car/8826/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1689,
    seats: 7,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-CFYF?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJiNjY2M2Y5NmVkNjc1ZDI2MjQxMmI1OGU3OTUzMTc3YSJ9",
  },
  {
    id: "GJQM",
    name: "Audi A1",
    category: "Economy",
    image: "https://fdsa.work/imagessx/sx105373520.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1153,
    seats: 4,
    transmission: "Manuell",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-GJQM?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJmZjI1MmU4YWFmMzYwZGRhMzE5ZDI3MjE3ZGJiMTY4MiJ9",
  },
  {
    id: "2T23",
    name: "Kia Niro",
    category: "Compact SUV",
    image: "https://www.discovercars.com/images/car/7978/220.png",
    supplier: "Budget",
    supplierRating: 8.6,
    ratingLabel: "Excellent",
    pricePerDay: 1019,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-2T23?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI1ZjQzMWI3MWNkM2RjMjIxM2M5YzgwYmM2NTBmMmJjZSJ9",
  },
  {
    id: "RQS8",
    name: "Volvo EX40",
    category: "Standard SUV",
    image: "https://fdsa.work/imagessx/sx123326744.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1198,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-RQS8?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiI2MjI0MWIyYTRjZjQ2NmYzMWQxMGM4OGVkM2FhZDkxNCJ9",
  },
  {
    id: "R4LQ",
    name: "Mercedes-Benz EQE",
    category: "Luxury SUV",
    image: "https://fdsa.work/imagessx/sx110662612.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 1987,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-R4LQ?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiIzOTM2Y2IzMjZiMDA4MzZjNDU0N2Q1ZjVmMzgyYzljZSJ9",
  },
  {
    id: "BEME",
    name: "Kia Niro",
    category: "Compact SUV",
    image: "https://www.discovercars.com/images/car/7978/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1122,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmo Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-BEME?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiY2Q1M2E0NjhmYTVmYTBhMmExYjcxYWM2MzM4NDk3Y2MifQ%3D%3D",
  },
  {
    id: "APDG",
    name: "BYD Seal",
    category: "Compact",
    image: "https://www.discovercars.com/images/car/8980/220.png",
    supplier: "Avis",
    supplierRating: 8.7,
    ratingLabel: "Excellent",
    pricePerDay: 1216,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmo Downtown",
    bookUrl: "https://www.discovercars.com/en/offer/a7caa328-dee6-43d3-94cf-c8ceeb5b0620-APDG?sq=eyJQaWNrdXBMb2NhdGlvbklkIjozNTkzMzUsIkRyb3BPZmZMb2NhdGlvbklkIjozNTkzMzUsIlBpY2t1cERhdGVUaW1lIjoiMjAyNi0wNS0xOFQxMTowMDowMCIsIkRyb3BPZmZEYXRlVGltZSI6IjIwMjYtMDUtMTlUMTE6MDA6MDAiLCJSZXNpZGVuY2VDb3VudHJ5IjoiU0UiLCJEcml2ZXJBZ2UiOjM1LCJIYXNoIjoiNmQ3NjI3Mjc2MmI1MmQyOGIxNTc4ZjI2YWZkZTViZjEifQ%3D%3D",
  },
  {
    id: "MKW8",
    name: "VW T-Roc",
    category: "Compact SUV",
    image: "https://fdsa.work/imagessx/sx21269345.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 8.5,
    ratingLabel: "Excellent",
    pricePerDay: 1197,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: true,
    locationName: "Malmö Airport (MMX)",
    bookUrl: "https://www.discovercars.com/en/offer/af3709d7-e15d-4c7b-ac36-5d405250a7d9-MKW8?sq=eyJQaWNrdXBMb2NhdGlvbklkIjoxNzg0LCJEcm9wT2ZmTG9jYXRpb25JZCI6MTc4NCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkOTkzM2FjNWIwOGQ3MzViZDE0ZTIxNGZkYmFmYTQ2MiJ9",
  },
  {
    id: "MQMF",
    name: "Volvo XC90",
    category: "Luxury SUV",
    image: "https://fdsa.work/imagessx/sx118704901.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 2288,
    seats: 5,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-MQMF?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJlZDBkNjUzYzI1YmI1NzA0Mzc5OTVmMzgyMThkNGFjZiJ9",
  },
  {
    id: "P3DR",
    name: "Mercedes-Benz CLE",
    category: "Luxury",
    image: "https://fdsa.work/imagessx/sx123326745.jpg/width/220",
    supplier: "SIXT",
    supplierRating: 9.0,
    ratingLabel: "Outstanding",
    pricePerDay: 5373,
    seats: 4,
    transmission: "Automat",
    freeCancellation: true,
    mileage: "Unlimited",
    isAirport: false,
    locationName: "Malmö Central Train Station",
    bookUrl: "https://www.discovercars.com/en/offer/459cdcc6-97bc-4cea-8998-e0ad6c22de79-P3DR?sq=eyJQaWNrdXBMb2NhdGlvbklkIjo3MzI4LCJEcm9wT2ZmTG9jYXRpb25JZCI6NzMyOCwiUGlja3VwRGF0ZVRpbWUiOiIyMDI2LTA1LTE4VDExOjAwOjAwIiwiRHJvcE9mZkRhdGVUaW1lIjoiMjAyNi0wNS0xOVQxMTowMDowMCIsIlJlc2lkZW5jZUNvdW50cnkiOiJTRSIsIkRyaXZlckFnZSI6MzUsIkhhc2giOiJkNWNmY2NlMzc4YjQ4NzA1NTY1MDI3YTYxN2ZmZTgyZiJ9",
  },
];

const CATEGORIES = [...new Set(CARS.map((c) => c.category))].sort();
const SUPPLIERS = [...new Set(CARS.map((c) => c.supplier))].sort();

const PER_PAGE = 12;

function norm(s: string) {
  return s.toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o");
}

const T = {
  sv: {
    title: "Hitta", em: "din hyrbil", sub: (n: number) => `${n} hyrbilar i Malmö — jämför pris, betyg och upphämtningsplats.`,
    location: "Upphämtningsplats", allLocations: "Alla",
    airport: "Malmö Airport", city: "Malmö City",
    rating: "Betyg", allRatings: "Alla betyg",
    r9: "9+", r85: "8.5+", r8: "8+",
    supplier: "Biluthyrningsföretag", allSuppliers: "Alla",
    category: "Biltyp",
    sort: "Sortera", popular: "Populärast", priceAsc: "Lägsta pris", priceDesc: "Högsta pris", ratingSort: "Bäst betyg",
    filter: "Filter",
    search: "Sök bilmodell, kategori eller företag…",
    showing: (a: number, b: number, t: number) => `Visar ${a}–${b} av ${t}`,
    perDay: "/dag",
    seats: "säten",
    freeCancellation: "Fri avbokning",
    book: "Visa erbjudande →",
    empty: "Inga bilar matchar dina filter.",
    reset: "Rensa filter",
    prev: "Föregående", next: "Nästa",
    unlimited: "Obegränsad",
  },
  en: {
    title: "Find", em: "your rental car", sub: (n: number) => `${n} rental cars in Malmö — compare price, rating and pickup location.`,
    location: "Pickup location", allLocations: "All",
    airport: "Malmö Airport", city: "Malmö City",
    rating: "Rating", allRatings: "All ratings",
    r9: "9+", r85: "8.5+", r8: "8+",
    supplier: "Car rental company", allSuppliers: "All",
    category: "Car type",
    sort: "Sort", popular: "Most popular", priceAsc: "Lowest price", priceDesc: "Highest price", ratingSort: "Best rating",
    filter: "Filter",
    search: "Search car model, category or company…",
    showing: (a: number, b: number, t: number) => `Showing ${a}–${b} of ${t}`,
    perDay: "/day",
    seats: "seats",
    freeCancellation: "Free cancellation",
    book: "View offer →",
    empty: "No cars match your filters.",
    reset: "Clear filters",
    prev: "Previous", next: "Next",
    unlimited: "Unlimited",
  },
  de: {
    title: "Finde", em: "dein Mietauto", sub: (n: number) => `${n} Mietautos in Malmö — Preis, Bewertung und Abholort vergleichen.`,
    location: "Abholort", allLocations: "Alle",
    airport: "Flughafen Malmö", city: "Malmö City",
    rating: "Bewertung", allRatings: "Alle",
    r9: "9+", r85: "8,5+", r8: "8+",
    supplier: "Autovermieter", allSuppliers: "Alle",
    category: "Fahrzeugtyp",
    sort: "Sortieren", popular: "Beliebteste", priceAsc: "Günstigster Preis", priceDesc: "Höchster Preis", ratingSort: "Beste Bewertung",
    filter: "Filter",
    search: "Automodell, Kategorie oder Anbieter suchen…",
    showing: (a: number, b: number, t: number) => `Zeige ${a}–${b} von ${t}`,
    perDay: "/Tag",
    seats: "Sitze",
    freeCancellation: "Kostenlose Stornierung",
    book: "Angebot ansehen →",
    empty: "Keine Autos entsprechen Ihren Filtern.",
    reset: "Filter zurücksetzen",
    prev: "Vorherige", next: "Nächste",
    unlimited: "Unbegrenzt",
  },
};

export default function HyraBilList() {
  const [lang, setLang] = useState<Lang>("sv");
  const [location, setLocation] = useState<Location>("all");
  const [minRating, setMinRating] = useState<string>("all");
  const [supplier, setSupplier] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const readLang = () => {
      try {
        const saved = localStorage.getItem("dm-lang") as Lang;
        if (saved && ["sv", "en", "de"].includes(saved)) setLang(saved);
      } catch {}
    };
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      if (["sv", "en", "de"].includes(l)) setLang(l);
    };
    readLang();
    window.addEventListener("storage", readLang);
    window.addEventListener("dm-lang-change", onCustom);
    return () => {
      window.removeEventListener("storage", readLang);
      window.removeEventListener("dm-lang-change", onCustom);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = CARS;
    if (location !== "all") list = list.filter((c) => c.isAirport === (location === "airport"));
    if (minRating !== "all") list = list.filter((c) => c.supplierRating >= parseFloat(minRating));
    if (supplier !== "all") list = list.filter((c) => c.supplier === supplier);
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (query.trim()) {
      const q = norm(query.trim());
      list = list.filter((c) =>
        norm(c.name).includes(q) ||
        norm(c.category).includes(q) ||
        norm(c.supplier).includes(q) ||
        norm(c.ratingLabel).includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price-desc") sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sort === "rating") sorted.sort((a, b) => b.supplierRating - a.supplierRating);
    else sorted.sort((a, b) => b.supplierRating - a.supplierRating);
    return sorted;
  }, [location, minRating, supplier, category, sort, query]);

  useEffect(() => { setPage(1); }, [location, minRating, supplier, category, sort, query]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const t = T[lang];

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setLocation("all"); setMinRating("all"); setSupplier("all");
    setCategory("all"); setQuery("");
  };

  return (
    <div className="upp-page hb-page">
      <header className="upp-header">
        <div className="upp-header-inner">
          <h1 className="upp-title">
            {t.title} <em>{t.em}</em>
          </h1>
          <p className="upp-sub">{t.sub(CARS.length)}</p>
          <div className="upp-search">
            <svg width="16" height="16" viewBox="0 0 16 16" className="upp-search-icon" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t.search}
            />
          </div>
        </div>
      </header>

      <div className="upp-mob-bar">
        <button className="upp-filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {t.filter}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{flexShrink:0}}>
            <path d={filtersOpen ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="upp-sort-pill">
          <span>{t.sort}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
            <option value="popular">{t.popular}</option>
            <option value="price-asc">{t.priceAsc}</option>
            <option value="price-desc">{t.priceDesc}</option>
            <option value="rating">{t.ratingSort}</option>
          </select>
        </div>
      </div>

      <section className={`upp-filters hb-filters${filtersOpen ? " mob-open" : ""}`} aria-label="Filter">
        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.location}</span>
          <div className="upp-chips">
            {([["all", t.allLocations], ["airport", `✈ ${t.airport}`], ["city", `🏙 ${t.city}`]] as [Location, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${location === key ? " active" : ""}`} onClick={() => setLocation(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.rating}</span>
          <div className="upp-chips">
            {([["all", t.allRatings], ["9", t.r9], ["8.5", t.r85], ["8", t.r8]] as [string, string][]).map(([key, label]) => (
              <button key={key} className={`upp-chip${minRating === key ? " active" : ""}`} onClick={() => setMinRating(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.supplier}</span>
          <div className="upp-chips">
            <button className={`upp-chip${supplier === "all" ? " active" : ""}`} onClick={() => setSupplier("all")}>{t.allSuppliers}</button>
            {SUPPLIERS.map((s) => (
              <button key={s} className={`upp-chip${supplier === s ? " active" : ""}`} onClick={() => setSupplier(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group">
          <span className="upp-filter-label">{t.category}</span>
          <div className="upp-chips">
            <button className={`upp-chip${category === "all" ? " active" : ""}`} onClick={() => setCategory("all")}>{t.allLocations}</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={`upp-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="upp-filter-group upp-sort">
          <span className="upp-filter-label">{t.sort}</span>
          <div className="upp-sort-pill">
            <span>{sort === "popular" ? t.popular : sort === "price-asc" ? t.priceAsc : sort === "price-desc" ? t.priceDesc : t.ratingSort}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort}>
              <option value="popular">{t.popular}</option>
              <option value="price-asc">{t.priceAsc}</option>
              <option value="price-desc">{t.priceDesc}</option>
              <option value="rating">{t.ratingSort}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="upp-count-row">
        <p className="upp-count">{t.showing((page - 1) * PER_PAGE + 1, Math.min(page * PER_PAGE, filtered.length), filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="upp-empty">
          <p>{t.empty}</p>
          <button className="upp-reset" onClick={resetFilters}>{t.reset}</button>
        </div>
      ) : (
        <>
          <section className="hb-grid">
            {paginated.map((car) => (
              <a key={car.id} href={car.bookUrl} target="_blank" rel="noopener noreferrer sponsored" className="hb-card">
                <div className="hb-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.image} alt={car.name} className="hb-card-img" loading="lazy" />
                  <span className={`hb-card-loc-tag ${car.isAirport ? "airport" : "city"}`}>
                    {car.isAirport ? `✈ ${t.airport}` : `🏙 ${t.city}`}
                  </span>
                </div>

                <div className="hb-card-body">
                  <div className="hb-card-meta">
                    <span className="hb-card-category">{car.category}</span>
                    <span className="hb-card-supplier">{car.supplier}</span>
                  </div>

                  <h3 className="hb-card-title">{car.name}</h3>

                  <div className="hb-card-specs">
                    <span>👥 {car.seats} {t.seats}</span>
                    <span>⚙️ {car.transmission}</span>
                    <span>🛣 {t.unlimited}</span>
                  </div>

                  <div className="hb-card-rating">
                    <span className="hb-rating-score">{car.supplierRating.toFixed(1)}</span>
                    <div className="hb-rating-bar">
                      <div className="hb-rating-fill" style={{ width: `${(car.supplierRating / 10) * 100}%` }} />
                    </div>
                    <span className="hb-rating-label">{car.ratingLabel}</span>
                  </div>

                  <div className="hb-card-footer">
                    <div className="hb-card-price-wrap">
                      <span className="hb-card-price">{car.pricePerDay.toLocaleString("sv-SE")} kr</span>
                      <span className="hb-card-price-unit">{t.perDay}</span>
                    </div>
                    <div className="hb-card-cta">
                      {car.freeCancellation && <span className="hb-free-cancel">✓ {t.freeCancellation}</span>}
                      <span className="hb-book-btn">{t.book}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="upp-pagination" aria-label="Sidnavigation">
              <button className="upp-page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label={t.prev}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                const showDot = (p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3);
                if (!show && !showDot) return null;
                if (showDot && !show) return <span key={p} className="upp-page-dots">…</span>;
                return (
                  <button key={p} className={`upp-page-btn${page === p ? " active" : ""}`} onClick={() => goToPage(p)} aria-label={`Sida ${p}`} aria-current={page === p ? "page" : undefined}>{p}</button>
                );
              })}
              <button className="upp-page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label={t.next}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </nav>
          )}
        </>
      )}

      <div className="hb-disclaimer">
        <p>Priser hämtade från Discover Cars. Klicka på en bil för aktuellt pris och bokning.</p>
      </div>
    </div>
  );
}
