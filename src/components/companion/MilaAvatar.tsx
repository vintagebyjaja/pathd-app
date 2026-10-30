"use client";
import {useState} from 'react';
/** This URL is a version-controlled official asset, never a user preference or uploaded file. */
export function MilaAvatar({size=36}:{size?:number}){const [failed,setFailed]=useState(false);return <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-lavender text-sm font-semibold text-plum" style={{width:size,height:size}} aria-hidden="true">{failed?'M':<img src="/companions/mila.webp" width={size} height={size} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 25%'}} alt="" loading="lazy" onError={()=>setFailed(true)}/>}</span>;}
