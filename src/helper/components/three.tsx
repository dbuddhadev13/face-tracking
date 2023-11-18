"use client";

import { r3fTunnel } from "@/helper/tunnel";
import { FunctionComponent, PropsWithChildren } from "react";

export const Three: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <r3fTunnel.In>{children}</r3fTunnel.In>;
};
