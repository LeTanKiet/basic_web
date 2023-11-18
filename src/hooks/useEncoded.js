import express from 'express';

export default function useEncoded(app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
}
