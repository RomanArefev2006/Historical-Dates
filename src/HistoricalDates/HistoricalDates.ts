import { gsap } from 'gsap';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { TimePeriod, EventItem } from './types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export class HistoricalDates {
    private container: HTMLElement;
    private data: TimePeriod[];
    private activeIndex: number = 0;
    private swiperInstance: Swiper | null = null;

    private circle: HTMLElement;
    private dotsCircle: HTMLElement[] = [];
    private dotsMobile: HTMLElement[] = [];
    private startYearEl: HTMLElement;
    private endYearEl: HTMLElement;
    private counterEl: HTMLElement;
    private btnPrev: HTMLButtonElement;
    private btnNext: HTMLButtonElement;
    private swiperWrapper: HTMLElement;
    private mobilePagination: HTMLElement;

    constructor(containerSelector: string, data: TimePeriod[]) {
        const root = document.querySelector(containerSelector) as HTMLElement;
        if (!root) throw new Error(`Container ${containerSelector} not found`);

        this.container = root;
        this.data = data;

        this.renderBaseStructure();

        this.circle = this.container.querySelector('.hd-circle') as HTMLElement;
        this.startYearEl = this.container.querySelector('.hd-year-start') as HTMLElement;
        this.endYearEl = this.container.querySelector('.hd-year-end') as HTMLElement;
        this.counterEl = this.container.querySelector('.hd-counter') as HTMLElement;
        this.btnPrev = this.container.querySelector('.hd-btn-prev') as HTMLButtonElement;
        this.btnNext = this.container.querySelector('.hd-btn-next') as HTMLButtonElement;
        this.swiperWrapper = this.container.querySelector('.swiper-wrapper') as HTMLElement;
        this.mobilePagination = this.container.querySelector('.hd-mobile-pagination') as HTMLElement;

        this.initDots();
        this.initSwiper();
        this.addEventListeners();
        
        this.update(0, true);
    }

    private renderBaseStructure(): void {
        this.container.classList.add('historical-dates');
        this.container.innerHTML = `
            <div class="hd-line-v"></div>
            <div class="hd-line-h"></div>
            
            <h1 class="hd-title">Исторические<br>даты</h1>
            
            <div class="hd-main">
                <div class="hd-years">
                    <span class="hd-year-start">0000</span>
                    <span class="hd-year-end">0000</span>
                </div>
                <div class="hd-circle-wrapper">
                    <div class="hd-circle"></div>
                </div>
            </div>

            <div class="hd-footer">
                <div class="hd-mobile-divider"></div>
                <div class="swiper hd-slider">
                    <div class="swiper-wrapper"></div>
                    <div class="swiper-pagination"></div>
                </div>

                <div class="hd-controls">
                    <div class="hd-controls-info">
                        <div class="hd-counter">00/00</div>
                        <div class="hd-nav">
                            <button class="hd-btn-prev">‹</button>
                            <button class="hd-btn-next">›</button>
                        </div>
                    </div>
                    <div class="hd-mobile-pagination"></div>
                </div>
            </div>
        `;
    }

    private initDots(): void {
        const count = this.data.length;
        const radius = this.circle.offsetWidth / 2;

        this.data.forEach((period, i) => {
            const dot = document.createElement('div');
            dot.className = 'hd-dot';
            const angle = -60 + (i * (360 / count));
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            
            dot.style.transform = `translate(${x}px, ${y}px)`;
            dot.innerHTML = `
                <div class="hd-dot-inner">
                    <div class="hd-dot-num">${i + 1}</div>
                    <div class="hd-dot-label">${period.title}</div>
                </div>
            `;
            dot.addEventListener('click', () => this.update(i));
            this.circle.appendChild(dot);
            this.dotsCircle.push(dot);

            const mDot = document.createElement('div');
            mDot.className = 'hd-mobile-dot';
            mDot.addEventListener('click', () => this.update(i));
            this.mobilePagination.appendChild(mDot);
            this.dotsMobile.push(mDot);
        });
    }

    private initSwiper(): void {
        const sliderEl = this.container.querySelector('.hd-slider') as HTMLElement;
        this.swiperInstance = new Swiper(sliderEl, {
            modules: [Navigation, Pagination],
            slidesPerView: 'auto',
            spaceBetween: 20,
            pagination: {
                el: this.container.querySelector('.swiper-pagination') as HTMLElement,
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                769: {
                    slidesPerView: 3,
                    spaceBetween: 80,
                    pagination: false as any
                }
            }
        });
    }

    private addEventListeners(): void {
        this.btnPrev.addEventListener('click', () => this.update(this.activeIndex - 1));
        this.btnNext.addEventListener('click', () => this.update(this.activeIndex + 1));
        
        window.addEventListener('resize', () => {
            const radius = this.circle.offsetWidth / 2;
            this.dotsCircle.forEach((dot, i) => {
                const angle = -60 + (i * (360 / this.data.length));
                const x = radius * Math.cos(angle * Math.PI / 180);
                const y = radius * Math.sin(angle * Math.PI / 180);
                dot.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    public update(index: number, isInitial: boolean = false): void {
        if (index < 0 || index >= this.data.length) return;
        if (!isInitial && index === this.activeIndex) return;

        this.activeIndex = index;
        const period = this.data[index];
        const step = 360 / this.data.length;
        const rotation = index * step;

        gsap.to(this.circle, { 
            rotation: -rotation, 
            duration: isInitial ? 0 : 1,
            ease: "power2.out" 
        });

        this.dotsCircle.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            const inner = dot.querySelector('.hd-dot-inner') as HTMLElement;
            if (inner) {
                gsap.to(inner, { rotation: rotation, duration: isInitial ? 0 : 1 });
            }
        });

        this.dotsMobile.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.animateNumber(this.startYearEl, period.startYear, isInitial);
        this.animateNumber(this.endYearEl, period.endYear, isInitial);

        this.counterEl.innerText = `${String(index + 1).padStart(2, '0')}/${String(this.data.length).padStart(2, '0')}`;
        this.btnPrev.disabled = index === 0;
        this.btnNext.disabled = index === this.data.length - 1;

        this.updateSliderContent(period.events, isInitial);
    }

    private animateNumber(el: HTMLElement, target: number, isInitial: boolean): void {
        const currentText = el.innerText.replace(/\D/g, '');
        const current = parseInt(currentText) || 0;

        if (isInitial) {
            el.innerText = String(target);
            return;
        }

        const obj = { val: current };
        gsap.to(obj, {
            val: target,
            duration: 1,
            roundProps: "val",
            onUpdate: () => {
                el.innerText = String(obj.val);
            }
        });
    }

    private updateSliderContent(events: EventItem[], isInitial: boolean): void {
        const renderSlides = () => {
            this.swiperWrapper.innerHTML = events.map(event => `
                <div class="swiper-slide">
                    <div class="hd-event-card">
                        <div class="hd-event-year">${event.year}</div>
                        <div class="hd-event-text">${event.description}</div>
                    </div>
                </div>
            `).join('');

            if (this.swiperInstance) {
                this.swiperInstance.update();
                this.swiperInstance.slideTo(0, 0);
            }
        };

        if (isInitial) {
            renderSlides();
        } else {
            gsap.to(this.swiperWrapper, {
                opacity: 0,
                y: 20,
                duration: 0.4,
                onComplete: () => {
                    renderSlides();
                    gsap.to(this.swiperWrapper, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        delay: 0.1
                    });
                }
            });
        }
    }
}