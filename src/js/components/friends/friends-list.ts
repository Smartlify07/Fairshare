import Component from '../../lib/component';
import store from '../../store';

export default class FriendsList extends Component {
  constructor() {
    super({
      element: document.getElementById('friends-section'),
      store: store,
    });
  }

  render(): void {
    const { friends } = store.state;
    const friendsList = friends.data
      .map(
        (friend) => `

      <li class="flex flex-col bg-surface items-center gap-[var(--space-sm)] min-w-[140px]  w-full max-w-none! md:max-w-[140px]! border-[0.5px] p-4 border-border rounded-xl">
          <div class='size-14 avatar-fallback flex items-center justify-center bg-neutral-100 text-size-lg rounded-full!'>${friend.name?.charAt(
            0
          )}</div>
          
        <h3 class="text-text text-sm text-center font-medium">${
          friend.name
        }</h3>
      </li>
    
    `
      )
      .join('');

    if (friends.loading) {
      this.element!.innerHTML = `
      <section>
        <h1 class="text-size-lg font-medium mb-[var(--space-lg)] font-heading text-text">
          Your Friends
        </h1>

        <div class="rounded-md grid gap-[var(--space-lg)]">
          <ul class="grid grid-cols-2 md:flex gap-[var(--space-lg)]">

            ${Array.from({ length: 3 })
              .map(
                () => `
              <li class="flex flex-col items-center gap-[var(--space-sm)] min-w-[140px] w-full md:max-w-[140px]! p-4 rounded-xl border border-border bg-surface animate-pulse">
                  <div class="size-14 rounded-full bg-muted/10"></div>

                  <div class="h-4 w-20 rounded-md bg-muted/10"></div>
              </li>
            `
              )
              .join('')}

          </ul>
        </div>
      </section>
    `;
      return;
    }

    this.element!.innerHTML = `
      <section class="">
          <h1 class="text-size-lg font-medium mb-[var(--space-lg)] font-heading text-text">
            Your Friends
          </h1>
        <div class="rounded-md grid gap-[var(--space-lg)]">
                
          ${
            friends.data.length > 0
              ? `<ul class="grid grid-cols-2 md:flex gap-[var(--space-lg)]">${friendsList}</ul>`
              : `<div class="card p-6 md:w-auto flex flex-col gap-5 justify-center items-center">
              <div class="rounded-full bg-primary/10 flex items-center justify-center size-16">
    <svg
                class="size-8"
                fill="var(--color-primary)"
                viewBox="0 -6 44 44"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M42.001,32.000 L14.010,32.000 C12.908,32.000 12.010,31.104 12.010,30.001 L12.010,28.002 C12.010,27.636 12.211,27.300 12.532,27.124 L22.318,21.787 C19.040,18.242 19.004,13.227 19.004,12.995 L19.010,7.002 C19.010,6.946 19.015,6.891 19.024,6.837 C19.713,2.751 24.224,0.007 28.005,0.007 C28.006,0.007 28.008,0.007 28.009,0.007 C31.788,0.007 36.298,2.749 36.989,6.834 C36.998,6.889 37.003,6.945 37.003,7.000 L37.006,12.994 C37.006,13.225 36.970,18.240 33.693,21.785 L43.479,27.122 C43.800,27.298 44.000,27.634 44.000,28.000 L44.000,30.001 C44.000,31.104 43.103,32.000 42.001,32.000 ZM31.526,22.880 C31.233,22.720 31.039,22.425 31.008,22.093 C30.978,21.761 31.116,21.436 31.374,21.226 C34.971,18.310 35.007,13.048 35.007,12.995 L35.003,7.089 C34.441,4.089 30.883,2.005 28.005,2.005 C25.126,2.006 21.570,4.091 21.010,7.091 L21.004,12.997 C21.004,13.048 21.059,18.327 24.636,21.228 C24.895,21.438 25.033,21.763 25.002,22.095 C24.972,22.427 24.778,22.722 24.485,22.882 L14.010,28.596 L14.010,30.001 L41.999,30.001 L42.000,28.595 L31.526,22.880 ZM18.647,2.520 C17.764,2.177 16.848,1.997 15.995,1.997 C13.116,1.998 9.559,4.083 8.999,7.083 L8.993,12.989 C8.993,13.041 9.047,18.319 12.625,21.220 C12.884,21.430 13.022,21.755 12.992,22.087 C12.961,22.419 12.767,22.714 12.474,22.874 L1.999,28.588 L1.999,29.993 L8.998,29.993 C9.550,29.993 9.997,30.441 9.997,30.993 C9.997,31.545 9.550,31.993 8.998,31.993 L1.999,31.993 C0.897,31.993 -0.000,31.096 -0.000,29.993 L-0.000,27.994 C-0.000,27.629 0.200,27.292 0.521,27.117 L10.307,21.779 C7.030,18.234 6.993,13.219 6.993,12.988 L6.999,6.994 C6.999,6.939 7.004,6.883 7.013,6.829 C7.702,2.744 12.213,-0.000 15.995,-0.000 C15.999,-0.000 16.005,-0.000 16.010,-0.000 C17.101,-0.000 18.262,0.227 19.369,0.656 C19.885,0.856 20.140,1.435 19.941,1.949 C19.740,2.464 19.158,2.720 18.647,2.520 Z"
                  ></path>
                </g>
              </svg>
              </div>

              <div class="flex flex-col gap-2 items-center">
                <h3 class="text-text font-medium text-center font-heading text-xl">
              You haven't added any friends yet
              </h3>
              <p class="text-sm text-muted text-center font-body">
              Start by inviting someone to split bills!
              </p>
              </div>
      </div>`
          }
        </div>
      </section>
    `;
  }
}
